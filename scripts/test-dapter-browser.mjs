import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import coverage from '../app/Demo/Dapter/Listing/coverage.json' with { type: 'json' };

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(
    base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname),
    'Use a local documentation application for browser verification.',
);
const artifacts = resolve(
    process.env.DAPTER_BROWSER_ARTIFACTS ??
        resolve(import.meta.dirname, '../storage/app/browser-verification/dapter'),
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const context = await browser.newContext({
    locale: 'en-US',
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
});
context.setDefaultTimeout(30_000);
const page = await context.newPage();
const pageErrors = [];
const requests = [];
const scriptPaths = new Set();
const results = [];
let verifiedPages = 0;
let decodedRows = 0;
let renderedRows = 0;
let mobile = null;
page.on('pageerror', (error) => pageErrors.push(error.message));
const isDapter = (request) =>
    request.method() === 'POST' && new URL(request.url()).pathname.startsWith('/dapter/data/');
page.on('request', (request) => {
    if (isDapter(request)) requests.push(request);
    if (request.resourceType() === 'script') scriptPaths.add(new URL(request.url()).pathname);
});
await page.addInitScript(() => {
    window.docsInitialNavigation = false;
    document.addEventListener('inertia:navigate', (event) => {
        if (event.detail.type === 'initial') window.docsInitialNavigation = true;
    });
});
let frame;
let viewport;
let grid;
function selectScenario(scenario) {
    frame = page.locator(`[data-demo-frame][data-dapter-scenario="${scenario.id}"]`);
    viewport = frame.locator('[data-demo-viewport]');
    grid = viewport.locator('wa-data-grid');
}
async function openScenario(scenario) {
    const before = requests.length;
    await page.goto(new URL(`/docs/${scenario.guide}`, base).href);
    await page.waitForFunction(() => window.docsInitialNavigation === true);
    selectScenario(scenario);
    await button('Start example').waitFor({ state: 'visible' });
    await page.waitForLoadState('networkidle');
    assert.equal(requests.length, before, 'Opening a focused guide performs no Dapter POST.');
    assert.equal(await page.getByText('Source declaration', { exact: true }).count(), 0);
}
const button = (name) => viewport.getByRole('button', { name, exact: true });

async function idle() {
    await page.evaluate(
        () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))),
    );
}

async function choose(select, value) {
    await select.click();
    await select.locator(`wa-option[value="${value}"]`).click();
    await page.waitForFunction(
        ({ label, value }) =>
            [...document.querySelectorAll('[data-demo-viewport] wa-select')].some(
                (element) => element.label === label && element.value === value && !element.open,
            ),
        { label: await select.evaluate((element) => element.label), value },
    );
}

async function requestAfter(action, scenario) {
    const before = requests.length;
    const [response] = await Promise.all([
        page.waitForResponse(
            (response) =>
                isDapter(response.request()) &&
                decodeURIComponent(new URL(response.url()).pathname).endsWith(
                    `/${scenario.source}`,
                ),
        ),
        action(),
    ]);
    const body = await response.json();
    await viewport.locator('[aria-busy="true"]').waitFor({ state: 'hidden' });
    await idle();
    assert.equal(requests.length, before + 1, 'One reader action sends one package request.');
    assert.equal(response.status(), scenario.expected.status, scenario.id);
    results.push({
        scenario: scenario.id,
        status: response.status(),
        request: response.request().postDataJSON(),
        response: body,
    });
    return body;
}

async function verifyPage(body, current, perPage) {
    const pages = Math.ceil(23 / perPage);
    const first = (current - 1) * perPage + 1;
    const count = Math.min(perPage, 24 - first);
    const expected = Array.from({ length: count }, (_, index) => {
        const id = first + index;
        return {
            id,
            name: `Notebook ${String(id).padStart(2, '0')}`,
            category: id % 2 === 0 ? 'Squared' : 'Plain',
        };
    });
    assert.deepEqual(body.data, expected, 'The real route returns the expected fictional rows.');
    assert.equal(body.paging.current, current);
    assert.equal(body.paging.per_page, perPage);
    assert.equal(body.paging.pages, pages);
    assert.equal(body.paging.total, 23);
    assert.equal(body.paging.filtered, 23);
    assert.equal(body.paging.has_previous, current > 1);
    assert.equal(body.paging.has_next, current < pages);
    await viewport
        .getByRole('status')
        .filter({ hasText: `Page ${current} of ${pages}. 23 total, 23 matching.` })
        .waitFor({ state: 'visible' });
    const accepted = JSON.parse(await viewport.locator('pre code').textContent());
    assert.equal(accepted.paging.current, current);
    assert.equal(accepted.paging.per_page, perPage);
    assert.equal(accepted.order.kind, 'source');
    await grid.scrollIntoViewIfNeeded();
    const scroller = grid.locator('[part="table"]');
    await scroller.evaluate((element) => element.scrollTo(0, 0));
    const observed = new Map();
    for (let position = 0; position < 8; position++) {
        await grid.locator('[role="gridcell"][data-col-id="name"]').first().waitFor();
        await idle();
        for (const row of await grid
            .locator('[part~="row"]')
            .evaluateAll((rows) =>
                rows.map((row) =>
                    ['id', 'name', 'category'].map((field) =>
                        row
                            .querySelector(`[role="gridcell"][data-col-id="${field}"]`)
                            ?.textContent.trim(),
                    ),
                ),
            )) {
            const product = { id: Number(row[0]), name: row[1], category: row[2] };
            assert.deepEqual(
                product,
                expected.find((item) => item.id === product.id),
                'The native grid renders decoded product cells.',
            );
            observed.set(product.id, product);
        }
        if (observed.size === count) break;
        await scroller.evaluate((element) =>
            element.scrollBy(0, Math.max(1, element.clientHeight - 50)),
        );
    }
    assert.deepEqual(
        [...observed.values()].sort((a, b) => a.id - b.id),
        expected,
    );
    for (const name of ['First', 'Previous'])
        assert.equal(await button(name).isDisabled(), current === 1);
    for (const name of ['Next', 'Last'])
        assert.equal(await button(name).isDisabled(), current === pages);
    assert.equal(await viewport.getByRole('alert').count(), 0);
    verifiedPages++;
    decodedRows += count;
    renderedRows += observed.size;
}

async function reset() {
    const before = requests.length;
    await button('Reset').click();
    await viewport.getByRole('status').filter({ hasText: 'Ready. Start the example' }).waitFor();
    assert.equal(await grid.count(), 0);
    await idle();
    assert.equal(requests.length, before, 'Reset does not request or restart a source.');
}

try {
    for (const scenario of coverage.cases) {
        await openScenario(scenario);
        assert.equal(await grid.count(), 0);
        const body = await requestAfter(() => button('Start example').click(), scenario);
        assert.equal(await button('Start example').isDisabled(), true);
        if (scenario.expected.status === 200) {
            const size = scenario.expected.per_page;
            assert.deepEqual(body.capabilities.paging.per_page_options, scenario.expected.options);
            await verifyPage(body, 1, size);
            const sizes = viewport.locator('wa-select').first();
            assert.deepEqual(
                await sizes
                    .locator('wa-option')
                    .evaluateAll((options) => options.map((option) => Number(option.value))),
                scenario.expected.options,
            );
            await frame.screenshot({ path: resolve(artifacts, `${scenario.id}.png`) });
            for (const value of scenario.expected.options.filter((value) => value !== size)) {
                const resized = await requestAfter(() => choose(sizes, String(value)), scenario);
                await verifyPage(resized, 1, value);
            }
        } else {
            assert.equal(body.error.kind, 'access');
            for (const key of ['data', 'paging', 'capabilities']) assert(!Object.hasOwn(body, key));
            await viewport.getByRole('alert').filter({ hasText: 'access' }).waitFor();
            assert.equal(await grid.count(), 0, 'Denied access renders no stale grid.');
            assert.equal(await viewport.locator('pre code').count(), 0);
            await frame.screenshot({ path: resolve(artifacts, `${scenario.id}.png`) });
            const retried = await requestAfter(() => button('Reload').click(), scenario);
            assert.equal(retried.error.kind, 'access');
        }
        await reset();
    }
    for (const id of ['CollectionFluent', 'SqliteProducts']) {
        const scenario = coverage.cases.find((item) => item.id === id);
        await openScenario(scenario);
        await verifyPage(await requestAfter(() => button('Start example').click(), scenario), 1, 5);
        for (const [name, current] of [
            ['Next', 2],
            ['Previous', 1],
            ['Last', 5],
            ['First', 1],
            ['Reload', 1],
        ]) {
            const body = await requestAfter(() => button(name).click(), scenario);
            await verifyPage(body, current, 5);
        }
        await reset();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    const scenario = coverage.cases.find((item) => item.id === 'SqliteProducts');
    await openScenario(scenario);
    await verifyPage(await requestAfter(() => button('Start example').click(), scenario), 1, 5);
    mobile = await page.evaluate(() => ({
        viewport: innerWidth,
        content: document.documentElement.scrollWidth,
    }));
    assert(mobile.content <= mobile.viewport + 1, 'The mobile guide has no document overflow.');
    await frame.screenshot({ path: resolve(artifacts, 'SqliteProducts-mobile.png') });
    await reset();
    await page.setViewportSize({ width: 1440, height: 1000 });
    const beforeShared = requests.length;
    await page.goto(new URL('/docs/dapter/composable', base).href);
    await page.waitForFunction(() => window.docsInitialNavigation === true);
    const sharedFrame = page.locator('[data-demo-frame][data-dapter-shared]');
    await sharedFrame.getByRole('button', { name: 'Start example', exact: true }).waitFor();
    await page.waitForLoadState('networkidle');
    assert.equal(requests.length, beforeShared, 'Composable examples wait for Start.');
    const [sharedInitial] = await Promise.all([
        page.waitForResponse(
            (response) =>
                isDapter(response.request()) && response.url().endsWith('/Dapter.CollectionFluent'),
        ),
        sharedFrame.getByRole('button', { name: 'Start example', exact: true }).click(),
    ]);
    await sharedFrame
        .getByRole('status')
        .filter({ hasText: 'Independent store reads page 1 with 5 rows.' })
        .waitFor();
    assert.equal(
        requests.length,
        beforeShared + 2,
        'Host, child, and bound view share one request; independent store makes one.',
    );
    frame = sharedFrame;
    viewport = sharedFrame.locator('[data-shared-store="catalog"]');
    grid = viewport.locator('wa-data-grid');
    const fluent = coverage.cases.find((item) => item.id === 'CollectionFluent');
    await verifyPage(await sharedInitial.json(), 1, 5);
    await verifyPage(await requestAfter(() => button('Next from host').click(), fluent), 2, 5);
    assert.match(await viewport.textContent(), /Host controls read page 2/);
    assert.match(await viewport.textContent(), /Child controls read page 2/);
    assert.match(
        await sharedFrame.locator('[data-shared-store="independent"]').textContent(),
        /page 1 with 5 rows/,
    );
    const independentResponse = page.waitForResponse((response) => isDapter(response.request()));
    await sharedFrame.getByRole('button', { name: 'Next independent page', exact: true }).click();
    assert.equal((await (await independentResponse).json()).paging.current, 2);
    await sharedFrame
        .getByRole('status')
        .filter({ hasText: 'Independent store reads page 2 with 5 rows.' })
        .waitFor();
    const defaults = coverage.cases.find((item) => item.id === 'CollectionDefaults');
    await verifyPage(
        await requestAfter(() => button('Use ten-row source').click(), defaults),
        1,
        10,
    );
    assert.match(await viewport.textContent(), /Child controls read page 1/);
    assert.match(
        await sharedFrame.locator('[data-shared-store="independent"]').textContent(),
        /page 2 with 5 rows/,
    );
    await verifyPage(
        await requestAfter(() => button('Reload from child').click(), defaults),
        1,
        10,
    );
    await sharedFrame.screenshot({ path: resolve(artifacts, 'SharedAdapter.png') });
    const beforeReset = requests.length;
    await sharedFrame.getByRole('button', { name: 'Reset', exact: true }).click();
    await sharedFrame.getByRole('status').filter({ hasText: 'Ready. Start the example' }).waitFor();
    assert.equal(await sharedFrame.locator('wa-data-grid').count(), 0);
    await idle();
    assert.equal(requests.length, beforeReset, 'Reset disposes shared owners without new work.');
    const getterFrame = page.locator('[data-demo-frame][data-dapter-getter]');
    frame = getterFrame;
    viewport = getterFrame.locator('[data-demo-viewport]');
    grid = viewport.locator('wa-data-grid');
    const quickstart = coverage.cases.find((item) => item.id === 'Quickstart');
    const getterInitial = await requestAfter(() => button('Start example').click(), quickstart);
    assert.equal(getterInitial.data.length, 10);
    await viewport.getByRole('status').filter({ hasText: 'Page 1 with 10 rows.' }).waitFor();
    await requestAfter(() => button('Next getter page').click(), quickstart);
    await viewport.getByRole('status').filter({ hasText: 'Page 2 with 10 rows.' }).waitFor();
    const getterChanged = await requestAfter(() => button('Use five-row source').click(), fluent);
    assert.equal(getterChanged.data.length, 5);
    await viewport.getByRole('status').filter({ hasText: 'Page 1 with 5 rows.' }).waitFor();
    await getterFrame.screenshot({ path: resolve(artifacts, 'ReactiveGetter.png') });
    await button('Reset').click();
    await viewport.getByRole('status').filter({ hasText: 'Ready. Start the example' }).waitFor();
    assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
    const report = {
        assetMode: [...scriptPaths].some((path) => path.startsWith('/@vite/')) ? 'hmr' : 'compiled',
        scriptPaths: [...scriptPaths],
        scenarios: coverage.cases.length,
        sharedAdapter: {
            initialRequests: 2,
            hostChildAndBoundView: true,
            independentStore: true,
            reactiveRef: true,
            reactiveGetter: true,
        },
        successfulScenarios: coverage.cases.filter((item) => item.expected.status === 200).length,
        deniedScenarios: coverage.cases.filter((item) => item.expected.status !== 200).length,
        requests: requests.length,
        verifiedPages,
        decodedRows,
        renderedRows,
        pagingSources: ['CollectionFluent', 'SqliteProducts'],
        mobile,
        pageErrors,
        artifacts,
    };
    await writeFile(resolve(artifacts, 'responses.json'), `${JSON.stringify(results, null, 2)}\n`);
    await writeFile(resolve(artifacts, 'summary.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
} catch (error) {
    await page.screenshot({ path: resolve(artifacts, 'failure.png'), fullPage: true });
    await writeFile(resolve(artifacts, 'responses.json'), `${JSON.stringify(results, null, 2)}\n`);
    console.error(JSON.stringify({ url: page.url(), requests: requests.length, pageErrors }));
    throw error;
} finally {
    await context.close();
    await browser.close();
}

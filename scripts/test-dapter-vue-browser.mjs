import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DAPTER_VUE_ARTIFACTS ?? 'storage/app/browser-verification/dapter-vue',
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
const readResponse = (response) =>
    new URL(response.url()).pathname.endsWith('/dapter/data/Dapter.VueCatalog');
async function clickRead(page, scope, label) {
    const response = page.waitForResponse(readResponse);
    await scope.getByRole('button', { name: label, exact: true }).click();
    const received = await response;
    assert.equal(received.status(), 200);
    return {
        body: await received.json(),
        request: JSON.parse(received.request().postData()),
        response: received,
    };
}
async function ids(scope, layout = 'table') {
    return scope
        .locator(`[data-vue-rows="${layout}"] [data-row-id]`)
        .evaluateAll((rows) => rows.map((row) => Number(row.dataset.rowId)));
}
try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            const page = await context.newPage();
            const errors = [];
            const urlTrace = [];
            page.on('framenavigated', (frame) => {
                if (frame === page.mainFrame()) urlTrace.push(frame.url());
            });
            const reads = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (
                    request.method() === 'POST' &&
                    new URL(request.url()).pathname.endsWith('/dapter/data/Dapter.VueCatalog')
                )
                    reads.push(request);
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            try {
                await page.goto(new URL('/docs/dapter/vue-controls', base).href);
                const entryScripts = await page
                    .locator('script[src]')
                    .evaluateAll((scripts) => scripts.map((script) => script.src));
                if (process.env.DAPTER_VUE_EXPECT_PRODUCTION === '1') {
                    assert.equal(
                        entryScripts.some((src) => src.includes('/@vite/client')),
                        false,
                    );
                    assert(entryScripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                }
                const controls = page.locator('[data-vue-controls-demo]');
                await controls
                    .getByText('Ready. Start controls to load the catalog.', { exact: true })
                    .waitFor();
                assert.equal(reads.length, 0);
                const cookies = await context.cookies();
                const first = await clickRead(page, controls, 'Start controls');
                assert.deepEqual(first.request, { version: 2 });
                const headers = await first.response.request().allHeaders();
                assert.equal(
                    headers['x-xsrf-token'],
                    decodeURIComponent(
                        cookies.find((cookie) => cookie.name === 'XSRF-TOKEN').value,
                    ),
                );
                await controls.locator('[data-vue-rows="table"] [data-row-id="1"]').waitFor();
                assert.deepEqual(await ids(controls), [1, 2]);
                assert.deepEqual(await ids(controls, 'grid'), [1, 2]);
                assert.equal(reads.length, 1);
                await clickRead(page, controls, 'Next catalog page');
                const ordered = await clickRead(page, controls, 'Name descending, keep page');
                assert.equal(ordered.request.state.paging.current, 2);
                assert.deepEqual(
                    ordered.body.data.map((row) => row.id),
                    [1, 2],
                );
                assert.deepEqual(ordered.request.state.order.terms, [
                    { field: 'name', direction: 'desc', sortType: 'natural' },
                ]);
                const clearedOrder = await clickRead(page, controls, 'Clear order');
                assert.equal(clearedOrder.request.state.paging.current, 1);
                assert.deepEqual(
                    clearedOrder.body.data.map((row) => row.id),
                    [1, 2],
                );
                const searchResponse = page.waitForResponse(readResponse);
                await controls
                    .getByRole('textbox', { name: 'Search name', exact: true })
                    .fill('Pencil');
                assert.equal((await searchResponse).status(), 200);
                await controls.locator('[data-vue-rows="table"] [data-row-id="3"]').waitFor();
                for (const [label, field, filter, value] of [
                    ['Inactive false', 'active', 'active', false],
                    ['Score zero', 'score', 'score', 0],
                    ['Selected null', 'optional', 'optional', null],
                ]) {
                    const selected = await clickRead(page, controls, label);
                    assert.deepEqual(selected.request.state.fields[field].filters[filter], {
                        value,
                    });
                    assert.deepEqual(
                        selected.body.data.map((row) => row.id),
                        [4],
                    );
                }
                await controls
                    .locator('[data-null-selection]')
                    .getByText('Current optional selection {"value":null}.', { exact: false })
                    .waitFor();
                const replacement = await clickRead(page, controls, 'Replace with paper snapshot');
                assert.deepEqual(replacement.request.state.fields, {
                    category: { filters: { category: { value: 'paper' } } },
                });
                assert.equal(replacement.body.paging.per_page, 4);
                await controls.locator('[data-vue-rows="table"] [data-row-id="1"]').waitFor();
                assert.deepEqual(await ids(controls), [1, 2]);
                assert.deepEqual(await ids(controls, 'grid'), [1, 2]);
                assert.equal(new URL(page.url()).searchParams.has('dapter[vue-controls]'), false);
                const defaults = await clickRead(page, controls, 'Restore server defaults');
                assert.deepEqual(defaults.request, { version: 2 });
                await controls.getByRole('button', { name: 'Reset controls', exact: true }).click();
                await page.screenshot({
                    path: resolve(artifacts, `controls-${width}-${theme}.png`),
                    fullPage: true,
                });

                await page.goto(new URL('/docs/dapter/vue-definitions', base).href);
                const definition = page.locator('[data-vue-definition-demo]');
                const previous = reads.length;
                await definition
                    .getByText('Ready. Start definition to load the narrowed catalog.', {
                        exact: true,
                    })
                    .waitFor();
                assert.equal(reads.length, previous);
                await clickRead(page, definition, 'Start definition');
                await definition
                    .getByText('Available matches contains. Current search none.', { exact: true })
                    .waitFor();
                assert.equal(
                    await definition
                        .getByRole('button', { name: 'Tools only', exact: true })
                        .count(),
                    0,
                );
                const target = definition.locator('[data-source-scroll]');
                await target.evaluate((element) => {
                    element.scrollTop = 80;
                });
                assert.equal(await target.evaluate((element) => element.scrollTop), 80);
                await clickRead(page, definition, 'Reload narrowed page');
                await definition.getByText('Narrowed catalog page 1.', { exact: true }).waitFor();
                assert.equal(await target.evaluate((element) => element.scrollTop), 80);
                await clickRead(page, definition, 'Next narrowed page');
                await definition.getByText('Narrowed catalog page 2.', { exact: true }).waitFor();
                await page.waitForFunction(
                    () => document.querySelector('[data-source-scroll]').scrollTop === 0,
                );
                await page.screenshot({
                    path: resolve(artifacts, `definition-${width}-${theme}.png`),
                    fullPage: true,
                });

                await page.goto(
                    new URL('/docs/dapter/vue-navigation?unrelated=retained#try-history', base)
                        .href,
                );
                const saved = page.locator('[data-vue-navigation-demo]');
                const beforeStart = reads.length;
                await saved
                    .getByText('Ready. Start saved catalogs to restore their URL state.', {
                        exact: true,
                    })
                    .waitFor();
                assert.equal(reads.length, beforeStart);
                await saved
                    .getByRole('button', { name: 'Start saved catalogs', exact: true })
                    .click();
                const reading = saved.locator('[data-navigation-owner="reading"]');
                const comparison = saved.locator('[data-navigation-owner="comparison"]');
                await reading
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                await comparison
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                assert.equal(reads.length, beforeStart + 2);
                await comparison.locator('[data-navigation-scroll]').evaluate((element) => {
                    element.scrollTop = 60;
                });
                await reading.locator('[data-navigation-scroll]').evaluate((element) => {
                    element.scrollTop = 80;
                });
                await clickRead(page, reading, 'Next saved page');
                await reading
                    .getByText('Saved catalog page 2. 4 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL((url) => url.searchParams.has('dapter[reading]'));
                await page.waitForFunction(
                    () =>
                        document.querySelector(
                            '[data-navigation-owner="reading"] [data-navigation-scroll]',
                        ).scrollTop === 0,
                );
                assert.equal(
                    await comparison
                        .locator('[data-navigation-scroll]')
                        .evaluate((element) => element.scrollTop),
                    60,
                );
                assert(new URL(page.url()).searchParams.has('unrelated'));
                assert.equal(new URL(page.url()).hash, '#try-history');
                await clickRead(page, comparison, 'Tools only');
                await comparison
                    .getByText('Saved catalog page 1. 2 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL((url) => url.searchParams.has('dapter[comparison]'));
                const twoOwnersUrl = page.url();
                const savedUrl = new URL(twoOwnersUrl);
                const readingSnapshot = JSON.parse(savedUrl.searchParams.get('dapter[reading]'));
                const comparisonSnapshot = JSON.parse(
                    savedUrl.searchParams.get('dapter[comparison]'),
                );
                assert.equal(readingSnapshot.version, 2);
                assert.equal(readingSnapshot.source, 'Dapter.VueCatalog');
                assert.equal(readingSnapshot.state.paging.current, 2);
                assert.equal(
                    comparisonSnapshot.state.fields.category.filters.category.value,
                    'tools',
                );
                await page.goBack();
                await comparison
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                await reading
                    .getByText('Saved catalog page 2. 4 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL(
                    (url) =>
                        !url.searchParams.has('dapter[comparison]') &&
                        JSON.parse(url.searchParams.get('dapter[reading]')).state.paging.current ===
                            2,
                );
                await page.goBack();
                await reading
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL(
                    (url) =>
                        !url.searchParams.has('dapter[reading]') &&
                        !url.searchParams.has('dapter[comparison]'),
                );
                assert.equal(new URL(page.url()).hash, '#try-history');
                await page.waitForFunction(
                    () =>
                        document.querySelector(
                            '[data-navigation-owner="reading"] [data-navigation-scroll]',
                        ).scrollTop === 80,
                );
                await page.goForward();
                await reading
                    .getByText('Saved catalog page 2. 4 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL(
                    (url) =>
                        url.searchParams.has('dapter[reading]') &&
                        !url.searchParams.has('dapter[comparison]'),
                );
                await page.goForward();
                await comparison
                    .getByText('Saved catalog page 1. 2 matching records.', { exact: true })
                    .waitFor();
                assert.equal(page.url(), twoOwnersUrl);
                const beforeReload = reads.length;
                await page.reload();
                await saved
                    .getByText('Ready. Start saved catalogs to restore their URL state.', {
                        exact: true,
                    })
                    .waitFor();
                assert.equal(reads.length, beforeReload);
                await saved
                    .getByRole('button', { name: 'Start saved catalogs', exact: true })
                    .click();
                await reading
                    .getByText('Saved catalog page 2. 4 matching records.', { exact: true })
                    .waitFor();
                await comparison
                    .getByText('Saved catalog page 1. 2 matching records.', { exact: true })
                    .waitFor();
                assert.equal(reads.length, beforeReload + 2);
                await page.screenshot({
                    path: resolve(artifacts, `navigation-${width}-${theme}.png`),
                    fullPage: true,
                });
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth),
                    width,
                );
                assert.deepEqual(errors, []);
                const malformed = new URL('/docs/dapter/vue-navigation', base);
                malformed.searchParams.set('dapter[reading]', 'invalid-json');
                await page.goto(malformed.href);
                await saved
                    .getByText('Ready. Start saved catalogs to restore their URL state.', {
                        exact: true,
                    })
                    .waitFor();
                const beforeMalformedStart = reads.length;
                await saved
                    .getByRole('button', { name: 'Start saved catalogs', exact: true })
                    .click();
                await reading.getByRole('alert').filter({ hasText: 'validation' }).waitFor();
                await comparison
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                assert.equal(reads.length, beforeMalformedStart + 1);
                const clampedSnapshot = structuredClone(readingSnapshot);
                clampedSnapshot.state.paging.current = 99;
                const clampedUrl = new URL('/docs/dapter/vue-navigation', base);
                clampedUrl.searchParams.set('dapter[reading]', JSON.stringify(clampedSnapshot));
                await page.goto(clampedUrl.href);
                await saved
                    .getByText('Ready. Start saved catalogs to restore their URL state.', {
                        exact: true,
                    })
                    .waitFor();
                const beforeClampedStart = reads.length;
                await saved
                    .getByRole('button', { name: 'Start saved catalogs', exact: true })
                    .click();
                await reading
                    .getByText('Saved catalog page 2. 4 matching records.', { exact: true })
                    .waitFor();
                await comparison
                    .getByText('Saved catalog page 1. 4 matching records.', { exact: true })
                    .waitFor();
                await page.waitForURL(
                    (url) =>
                        JSON.parse(url.searchParams.get('dapter[reading]')).state.paging.current ===
                        2,
                );
                assert.equal(reads.length, beforeClampedStart + 2);
                assert.equal(
                    reads
                        .slice(beforeClampedStart)
                        .filter(
                            (request) =>
                                JSON.parse(request.postData()).state?.paging.current === 99,
                        ).length,
                    1,
                );
                assert.deepEqual(errors, []);
                results.push({ width, theme, entryScripts, reads: reads.length, errors });
            } catch (error) {
                await page.screenshot({
                    path: resolve(artifacts, `failure-${width}-${theme}.png`),
                    fullPage: true,
                });
                await writeFile(
                    resolve(artifacts, `failure-${width}-${theme}.json`),
                    JSON.stringify(
                        {
                            url: page.url(),
                            urlTrace,
                            entryScripts: await page
                                .locator('script[src]')
                                .evaluateAll((scripts) => scripts.map((script) => script.src)),
                            errors,
                            scrollPositions: await page
                                .locator('[data-navigation-scroll]')
                                .evaluateAll((elements) =>
                                    elements.map((element) => ({
                                        owner: element.closest('[data-navigation-owner]')?.dataset
                                            .navigationOwner,
                                        top: element.scrollTop,
                                        left: element.scrollLeft,
                                    })),
                                ),
                            body: await page.locator('body').innerText(),
                        },
                        null,
                        2,
                    ),
                );
                throw error;
            } finally {
                await context.close();
            }
        }
    }
    await writeFile(resolve(artifacts, 'summary.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(
        'Verified Dapter Vue HTTP and CSRF, shared table/grid controls, scalar values, replacement/reset, independent URL history and reload, and declared scroll regions in four browser sessions.',
    );
} finally {
    await browser.close();
}

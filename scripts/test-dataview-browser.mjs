import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DATA_VIEW_ARTIFACTS ?? 'storage/app/browser-verification/data-view',
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
const sourceResponse = (source) => (response) =>
    new URL(response.url()).pathname.endsWith(`/dapter/data/${source}`);
async function read(page, scope, label, source) {
    const pending = page.waitForResponse(sourceResponse(source));
    await scope.getByRole('button', { name: label, exact: true }).click();
    const response = await pending;
    assert.equal(response.status(), 200);
    return {
        response,
        request: JSON.parse(response.request().postData()),
        body: await response.json(),
    };
}
async function choose(scope, label, option) {
    const host = scope.locator('wa-select').filter({
        has: scope.page().getByRole('combobox', { name: label, exact: true }),
    });
    const input = host.getByRole('combobox', { name: label, exact: true });
    const opened = host.evaluate(
        (element) =>
            new Promise((done) =>
                element.addEventListener('wa-after-show', () => done(), { once: true }),
            ),
    );
    await input.click();
    await opened;
    const closed = host.evaluate(
        (element) =>
            new Promise((done) =>
                element.addEventListener('wa-after-hide', () => done(), { once: true }),
            ),
    );
    await scope.getByRole('option', { name: option, exact: true }).click();
    await closed;
}
try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            const page = await context.newPage();
            const errors = [],
                reads = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (new URL(request.url()).pathname.includes('/dapter/data/')) reads.push(request);
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            try {
                await page.goto(new URL('/docs/front-awesome/development/data-view', base).href);
                const main = page.getByTestId('data-view-demo');
                await main.getByText('No source is running.', { exact: true }).waitFor();
                assert.equal(reads.length, 0);
                if (process.env.DATA_VIEW_EXPECT_PRODUCTION === '1') {
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((items) => items.map((item) => item.src));
                    assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                }
                await read(page, main, 'Start catalog', 'Dapter.CollectionFluent');
                await main.locator('tbody strong').filter({ hasText: 'Notebook 01' }).waitFor();
                let release;
                const gate = new Promise((resolveGate) => {
                    release = resolveGate;
                });
                await page.route(
                    '**/dapter/data/Dapter.CollectionFluent',
                    async (route) => {
                        const response = await route.fetch();
                        await gate;
                        await route.fulfill({ response });
                    },
                    { times: 1 },
                );
                const pending = page.waitForResponse(sourceResponse('Dapter.CollectionFluent'));
                await main.getByRole('button', { name: 'Next', exact: true }).click();
                await main.getByText('Updating results…', { exact: false }).waitFor();
                await main.getByRole('button', { name: 'Grid', exact: true }).click();
                await main.locator('li wa-card').filter({ hasText: 'Notebook 01' }).waitFor();
                release();
                assert.equal((await pending).status(), 200);
                await main.locator('li wa-card').filter({ hasText: 'Notebook 06' }).waitFor();
                await main.getByRole('button', { name: 'List', exact: true }).click();
                await main.locator('li strong').filter({ hasText: 'Notebook 06' }).waitFor();
                await main.getByRole('button', { name: 'Table', exact: true }).click();
                await main.locator('tbody strong').filter({ hasText: 'Notebook 06' }).waitFor();
                assert.equal(reads.length, 2);
                await main.screenshot({
                    path: resolve(artifacts, `${width}-${theme}-catalog.png`),
                });
                await main
                    .locator('wa-details')
                    .getByRole('button', { name: 'Layout settings and adapter state', exact: true })
                    .click();
                await choose(main, 'Configured layouts', 'Table only');
                assert.equal(
                    await main.getByRole('group', { name: 'Results layout', exact: true }).count(),
                    0,
                );
                await choose(main, 'Configured layouts', 'Grid only');
                assert.equal(await main.locator('table').count(), 0);
                assert.equal(reads.length, 2);
                await main.getByRole('button', { name: 'Reset', exact: true }).click();
                const denied = page.waitForResponse(sourceResponse('Dapter.CollectionGateDeny'));
                await main.getByRole('button', { name: 'Try denied source', exact: true }).click();
                assert.equal((await denied).status(), 403);
                await main
                    .getByRole('alert')
                    .filter({ hasText: /denied/i })
                    .waitFor();
                assert.equal(await main.locator('tbody tr').count(), 0);

                const capabilities = page.getByTestId('data-view-capabilities');
                await read(page, capabilities, 'Start capabilities', 'Dapter.ComposedCatalog');
                await capabilities.getByText(/Shared handle yes/).waitFor();
                const searchRead = page.waitForResponse(sourceResponse('Dapter.ComposedCatalog'));
                await capabilities
                    .getByRole('textbox', { name: 'Search results', exact: true })
                    .fill('Notebook');
                const searched = await searchRead;
                assert.equal(
                    JSON.parse(searched.request().postData()).state.global.search.value,
                    'Notebook',
                );
                const filtered = await read(
                    page,
                    capabilities,
                    'Paused notebooks',
                    'Dapter.ComposedCatalog',
                );
                assert.equal(filtered.request.state.global.filters.status.value, 'paused');
                assert(filtered.body.data.every((row) => row.status === 'paused'));
                const ordered = await read(
                    page,
                    capabilities,
                    'Notebook',
                    'Dapter.ComposedCatalog',
                );
                assert.equal(ordered.request.state.order.terms[0].field, 'name');
                const presetRead = page.waitForResponse(sourceResponse('Dapter.ComposedCatalog'));
                await choose(capabilities, 'Order results', 'Newest first');
                assert.deepEqual(JSON.parse((await presetRead).request().postData()).state.order, {
                    kind: 'preset',
                    id: 'reverse',
                });
                await capabilities.screenshot({
                    path: resolve(artifacts, `${width}-${theme}-capabilities.png`),
                });

                const action = page.getByTestId('data-view-actions');
                await read(page, action, 'Start actions', 'Dapter.ActionCatalog');
                const write = page.waitForResponse((response) =>
                    response.url().includes('/dapter/actions/'),
                );
                await action
                    .getByRole('button', { name: 'Save fictional notebook', exact: true })
                    .click();
                assert.equal((await write).status(), 200);
                await action.getByText(/Outcome completed\. Commit confirmed/).waitFor();
                await read(page, action, 'Reload write counter', 'Dapter.ActionCatalog');

                for (const source of [
                    'Dapter.PagingSimple',
                    'Dapter.PagingCursor',
                    'Dapter.InfiniteSimple',
                ]) {
                    const scope = page.locator(`[data-paging-demo="${source}"]`);
                    const initial = await read(page, scope, 'Start traversal', source);
                    await scope
                        .locator('[data-paging-summary]')
                        .getByText(/Exact total unknown/)
                        .waitFor();
                    assert.equal(
                        await scope.getByRole('button', { name: 'Last', exact: true }).count(),
                        0,
                    );
                    const next = await read(
                        page,
                        scope,
                        source === 'Dapter.InfiniteSimple' ? 'Load more' : 'Next',
                        source,
                    );
                    await scope.locator('tbody tr').first().waitFor();
                    if (source === 'Dapter.InfiniteSimple') {
                        await page.waitForFunction(
                            () =>
                                document.querySelector(
                                    '[data-paging-demo="Dapter.InfiniteSimple"] tbody',
                                )?.children.length === 4,
                        );
                        assert.equal(next.body.data.length + initial.body.data.length, 4);
                    }
                }
                const overflow = await page.evaluate(
                    () => document.documentElement.scrollWidth > innerWidth,
                );
                assert.equal(overflow, false);
                assert.deepEqual(errors, []);
                await page.screenshot({
                    path: resolve(artifacts, `${width}-${theme}.png`),
                    fullPage: true,
                });
                results.push({
                    width,
                    theme,
                    assertions:
                        'No initial reads; pending switch; layouts; denial; capability requests; action; simple/cursor/infinite; no page overflow or runtime errors',
                });
            } finally {
                await context.close();
            }
        }
    }
} finally {
    await browser.close();
}
await writeFile(resolve(artifacts, 'results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve('storage/app/browser-verification/dapter-composed');
await mkdir(artifacts, { recursive: true });
const cases = JSON.parse(await readFile('app/Demo/Dapter/Composed/cases.json', 'utf8'));
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
try {
    for (const width of [1440, 390])
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            const page = await context.newPage(),
                errors = [],
                reads = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (request.url().includes('/dapter/data/Dapter.Composed')) reads.push(request);
            });
            try {
                for (const guide of new Set(cases.map((item) => item.guide))) {
                    await page.goto(new URL('/docs/' + guide, base).href);
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((items) => items.map((item) => item.src));
                    assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                    for (const example of cases.filter((item) => item.guide === guide)) {
                        const frame = page.locator(`[data-composed-scenario="${example.id}"]`);
                        await frame
                            .getByText('Ready. Send the fixed version 2 request to start.', {
                                exact: true,
                            })
                            .waitFor();
                        const wait = page.waitForResponse((response) =>
                            new URL(response.url()).pathname.endsWith(
                                '/dapter/data/' + example.source,
                            ),
                        );
                        await frame
                            .getByRole('button', { name: 'Send request', exact: true })
                            .click();
                        const response = await wait;
                        assert.equal(response.status(), example.expected.status);
                        assert.deepEqual(
                            JSON.parse(response.request().postData()),
                            example.request,
                        );
                        const body = await response.json();
                        if (response.ok()) {
                            const key = body.data[0]?.record_id === undefined ? 'id' : 'record_id';
                            assert.deepEqual(
                                body.data.map((row) => row[key]),
                                example.expected.ids,
                            );
                            assert.equal(body.paging.filtered, example.expected.filtered);
                        }
                        await frame
                            .getByText(`HTTP ${example.expected.status}`, { exact: true })
                            .waitFor();
                        await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                    }
                }
                await page.goto(new URL('/docs/dapter/global-search', base).href);
                const frame = page.locator('[data-composed-controls]');
                const before = reads.length;
                await frame
                    .getByText('Ready. Start composed controls to read.', { exact: true })
                    .waitFor();
                assert.equal(reads.length, before);
                const change = async (interact) => {
                    const next = page.waitForResponse((response) =>
                        response.url().includes('/dapter/data/Dapter.ComposedCatalog'),
                    );
                    await interact();
                    const response = await next;
                    assert.equal(response.status(), 200);
                    return response.json();
                };
                const read = (label) =>
                    change(() => frame.getByRole('button', { name: label, exact: true }).click());
                await read('Start composed controls');
                await frame.locator('[data-composed-row="4"]').waitFor();
                await change(() =>
                    frame.getByLabel('Global catalog search', { exact: true }).fill('0'),
                );
                const all = await change(() =>
                    frame.getByLabel('Product name contains', { exact: true }).fill('Notebook'),
                );
                assert.equal(all.requested.fields.name.search.matchType, 'contains');
                assert.deepEqual(
                    all.data.map((row) => row.id),
                    [1],
                );
                await frame.getByRole('combobox', { name: 'Search grouping', exact: true }).click();
                const any = await change(() =>
                    frame.getByRole('option', { name: 'Any', exact: true }).click(),
                );
                assert.equal(any.requested.searchMatch, 'any');
                assert.deepEqual(
                    any.data.map((row) => row.id),
                    [1, 2, 3],
                );
                await read('Restore composed defaults');
                const paused = await read('Paused only');
                assert.deepEqual(
                    paused.data.map((row) => row.id),
                    [2],
                );
                await read('Clear status');
                await read('Order by name');
                const ordered = await read('Append quantity');
                assert.equal(ordered.requested.order.terms.length, 2);
                await frame
                    .getByText('Name priority 1. Quantity priority 2.', { exact: true })
                    .waitFor();
                const preset = await read('Newest preset');
                assert.equal(preset.state.order.opaque, true);
                assert.equal(preset.requested.order.kind, 'preset');
                await read('Clear preset');
                await frame.getByLabel('Global catalog search', { exact: true }).fill('Notebook');
                await frame.locator('[data-composed-row="3"]').waitFor({ state: 'detached' });
                await page.waitForURL((url) =>
                    url.searchParams.has('dapter_composed_catalog.composed-controls'),
                );
                const saved = page.url();
                await page.reload();
                const restart = page.waitForResponse((response) =>
                    response.url().includes('/dapter/data/Dapter.ComposedCatalog'),
                );
                await page
                    .locator('[data-composed-controls]')
                    .getByRole('button', { name: 'Start composed controls', exact: true })
                    .click();
                assert.equal((await restart).status(), 200);
                await page.locator('[data-composed-row="2"]').waitFor();
                assert.equal(await page.locator('[data-composed-row]').count(), 2);
                assert.equal(
                    new URL(page.url()).searchParams.get(
                        'dapter_composed_catalog.composed-controls',
                    ),
                    new URL(saved).searchParams.get('dapter_composed_catalog.composed-controls'),
                );
                assert.deepEqual(errors, []);
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
                    false,
                );
                await page.screenshot({
                    path: resolve(artifacts, `${width}-${theme}.png`),
                    fullPage: true,
                });
                results.push({ width, theme, requests: reads.length, cases: cases.length, errors });
            } catch (error) {
                await page.screenshot({
                    path: resolve(artifacts, `failure-${width}-${theme}.png`),
                    fullPage: true,
                });
                await writeFile(
                    resolve(artifacts, `failure-${width}-${theme}.txt`),
                    await page.locator('body').innerText(),
                );
                throw error;
            } finally {
                await context.close();
            }
        }
    await writeFile(resolve(artifacts, 'summary.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(
        'Verified fixed composed reads, native SQLite, real global controls, additive priority, presets, cold URL restoration, and four production browser layouts.',
    );
} finally {
    await browser.close();
}

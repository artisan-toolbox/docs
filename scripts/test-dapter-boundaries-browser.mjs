import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DAPTER_BOUNDARIES_ARTIFACTS ??
        resolve(import.meta.dirname, '../storage/app/browser-verification/dapter-boundaries'),
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const expected = [
    { id: 101, name: 'North notebook', studio: 'studio-north', source_calls: 1 },
    { id: 102, name: 'North pencil', studio: 'studio-north', source_calls: 1 },
];
const isRead = (request) =>
    request.method() === 'POST' &&
    new URL(request.url()).pathname === '/dapter/data/Dapter.ScopedRecords';
const results = [];

try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
                locale: 'en-US',
            });
            let page;
            const errors = [];
            try {
                await context.routeWebSocket('**', () => {});
                await context.route('**/_boost/browser-logs', (route) =>
                    route.fulfill({ status: 204 }),
                );
                page = await context.newPage();
                const requests = [];
                page.on('pageerror', (error) => errors.push(error.message));
                page.on('request', (request) => {
                    if (isRead(request)) requests.push(request);
                });
                await page.goto(new URL('/docs/dapter/source-boundaries', base).href);
                const frame = page.locator('[data-demo-frame]');
                const rows = frame.locator('[data-scoped-records] > li');
                const idle = frame.getByText('Ready. Start the example to read studio-north.', {
                    exact: true,
                });
                await idle.waitFor();
                assert.equal(requests.length, 0);
                assert.equal(await rows.count(), 0);
                const url = page.url();

                async function read(label, defaults = false) {
                    const received = page.waitForResponse((response) => isRead(response.request()));
                    await frame.getByRole('button', { name: label, exact: true }).click();
                    const response = await received;
                    assert.equal(response.status(), 200);
                    const raw = await response.text();
                    const body = JSON.parse(raw);
                    const request = response.request().postDataJSON();
                    assert.equal(request.version, 1);
                    assert.equal('state' in request, !defaults);
                    if (!defaults) assert.equal(request.state.paging.current, 1);
                    assert.deepEqual(body.data, expected);
                    assert.equal(body.paging.total, 2);
                    assert.equal(body.paging.filtered, 2);
                    assert.equal(body.paging.pages, 1);
                    assert.equal(body.paging.per_page, 2);
                    assert.deepEqual(body.capabilities.paging.per_page_options, [2]);
                    assert(!raw.includes('private_note'));
                    assert(!raw.includes('studio-south'));
                    await frame
                        .getByText('Loaded 2 scoped records. Each source ran once.', {
                            exact: true,
                        })
                        .waitFor();
                    assert.deepEqual(
                        (await rows.allTextContents()).map((text) =>
                            text.replace(/\s+/g, ' ').trim(),
                        ),
                        ['North notebook. Source calls 1.', 'North pencil. Source calls 1.'],
                    );
                    assert.equal(page.url(), url);
                }

                await read('Start example', true);
                await read('Reload records');
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await idle.waitFor();
                assert.equal(await rows.count(), 0);
                assert.equal(requests.length, 2);
                await read('Start example', true);
                await read('Reload records');
                const geometry = await page.evaluate(() => ({
                    viewport: window.innerWidth,
                    document: document.documentElement.scrollWidth,
                }));
                assert.equal(geometry.document, geometry.viewport);
                await frame.screenshot({
                    path: resolve(artifacts, `boundaries-${width}-${theme}.png`),
                });
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await idle.waitFor();
                assert.equal(await rows.count(), 0);
                assert.equal(requests.length, 4);
                assert.deepEqual(errors, []);
                results.push({ width, theme, requests: requests.length, geometry, errors });
            } catch (error) {
                if (page) {
                    await page.screenshot({
                        path: resolve(artifacts, `failure-${width}-${theme}.png`),
                        fullPage: true,
                    });
                    await writeFile(
                        resolve(artifacts, `failure-${width}-${theme}.json`),
                        JSON.stringify(
                            {
                                url: page.url(),
                                errors,
                                body: await page.locator('body').innerText(),
                            },
                            null,
                            2,
                        ),
                    );
                }
                throw error;
            } finally {
                await context.close();
            }
        }
    }
    await writeFile(resolve(artifacts, 'summary.json'), `${JSON.stringify(results, null, 2)}\n`);
    console.log(
        'Verified four source-boundary sessions, scoped public rows, fresh source calls, reload, reset, no initial read, and zero browser errors.',
    );
} finally {
    await browser.close();
}

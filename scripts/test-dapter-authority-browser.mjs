import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DAPTER_AUTHORITY_ARTIFACTS ??
        resolve(import.meta.dirname, '../storage/app/browser-verification/dapter-authority'),
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
const isRead = (request) =>
    request.method() === 'POST' && new URL(request.url()).pathname.startsWith('/dapter/data/');

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
                await page.goto(new URL('/docs/dapter/authority', base).href);
                const frame = page.locator('[data-demo-frame]');
                await frame
                    .getByText('Ready. Choose a request to start.', { exact: true })
                    .waitFor();
                assert.equal(requests.length, 0);

                async function send(label) {
                    const responsePromise = page.waitForResponse((response) =>
                        isRead(response.request()),
                    );
                    await frame.getByRole('button', { name: label, exact: true }).click();
                    const response = await responsePromise;
                    return {
                        status: response.status(),
                        body: await response.json(),
                        request: response.request().postDataJSON(),
                    };
                }
                function example(label) {
                    return frame
                        .locator('figure')
                        .filter({ has: page.locator('figcaption').filter({ hasText: label }) })
                        .locator('pre code');
                }

                const allowed = await send('Request allowed size 10');
                assert.equal(allowed.status, 200);
                assert.equal(allowed.body.data.length, 10);
                assert.equal(allowed.body.capabilities.paging.per_page, 5);
                assert.deepEqual(allowed.body.capabilities.paging.per_page_options, [5, 10]);
                await example('Actual server response').waitFor();
                assert.deepEqual(
                    JSON.parse(await example('Actual server response').textContent()),
                    allowed.body,
                );

                for (const [label, kind, code] of [
                    ['Request disallowed size 7', 'validation', 'invalid_request'],
                    ['Request undeclared field', 'unsupported_operation', 'unsupported_operation'],
                ]) {
                    const rejected = await send(label);
                    assert.equal(rejected.status, 422);
                    assert.equal(rejected.body.error.kind, kind);
                    assert.equal(rejected.body.error.code, code);
                    assert(!('data' in rejected.body));
                    assert(!('capabilities' in rejected.body));
                    await frame.getByRole('alert').waitFor();
                    assert.match(
                        await example('Actual Inertia validation feedback').textContent(),
                        new RegExp(kind),
                    );
                    assert.equal(await example('Actual server response').count(), 0);
                }

                const bounded = await send('Request page 999');
                assert.equal(bounded.status, 200);
                assert.equal(bounded.request.state.paging.current, 999);
                assert.equal(bounded.body.requested.paging.current, 3);
                assert.equal(bounded.body.state.paging.current, 3);
                assert.equal(bounded.body.paging.current, 3);
                assert.equal(bounded.body.data.length, 3);
                await example('Actual server response').waitFor();
                assert.equal(
                    JSON.parse(await example('Actual outgoing request').textContent()).state.paging
                        .current,
                    999,
                );
                assert.deepEqual(
                    JSON.parse(await example('Actual server response').textContent()),
                    bounded.body,
                );
                const geometry = await page.evaluate(() => ({
                    viewport: window.innerWidth,
                    document: document.documentElement.scrollWidth,
                }));
                assert.equal(geometry.document, geometry.viewport);
                await frame.screenshot({
                    path: resolve(artifacts, `authority-${width}-${theme}.png`),
                });
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await frame
                    .getByText('Ready. Choose a request to start.', { exact: true })
                    .waitFor();
                assert.equal(requests.length, 4);
                assert.equal(await example('Actual outgoing request').count(), 0);
                assert.deepEqual(errors, []);
                results.push({
                    width,
                    theme,
                    requests: requests.length,
                    allowed,
                    bounded,
                    geometry,
                    errors,
                });
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
        'Verified four authority sessions, declared choices, rejected requests, bounded acknowledgements, reset, and zero browser errors.',
    );
} finally {
    await browser.close();
}

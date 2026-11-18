import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import contract from '@artisan-toolbox/dapter/contracts/read-v1.json' with { type: 'json' };
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DAPTER_PROTOCOL_ARTIFACTS ??
        resolve(import.meta.dirname, '../storage/app/browser-verification/dapter-protocol'),
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
                const frame = page.locator('[data-demo-frame]');
                function example(label) {
                    return frame
                        .locator('figure')
                        .filter({
                            has: page.locator('figcaption').getByText(label, { exact: true }),
                        })
                        .locator('pre code');
                }
                async function send(label, id) {
                    const expected = contract.requests.find((item) => item.id === id);
                    assert(expected);
                    const cookies = await context.cookies();
                    const responsePromise = page.waitForResponse((response) =>
                        isRead(response.request()),
                    );
                    await frame.getByRole('button', { name: label, exact: true }).click();
                    const response = await responsePromise;
                    const body = await response.text();
                    assert.equal(response.status(), expected.status);
                    assert.equal(response.request().postData(), expected.request_json);
                    assert.deepEqual(JSON.parse(body), expected.response);
                    const headers = await response.request().allHeaders();
                    assert(
                        headers['x-xsrf-token'] ===
                            decodeURIComponent(
                                cookies.find((cookie) => cookie.name === 'XSRF-TOKEN').value,
                            ),
                        'The outgoing CSRF header must match the cookie held before the request.',
                    );
                    await page.waitForFunction((expectedBody) => {
                        const figure = [
                            ...document.querySelectorAll('[data-demo-frame] figure'),
                        ].find((item) =>
                            item
                                .querySelector('figcaption')
                                ?.textContent.includes('Actual server response bytes'),
                        );
                        return figure?.querySelector('pre code')?.textContent === expectedBody;
                    }, body);
                    assert.equal(
                        await example('Actual outgoing request bytes').textContent(),
                        expected.request_json,
                    );
                    assert.equal(await example('Actual server response bytes').textContent(), body);
                    return JSON.parse(body);
                }

                await page.goto(new URL('/docs/dapter/protocol', base).href);
                await frame
                    .getByText('Ready. Choose a request to start.', { exact: true })
                    .waitFor();
                assert.equal(requests.length, 0);
                const defaults = await send('Read source defaults', 'defaults');
                assert.deepEqual(defaults.data, contract.fixture.rows.slice(0, 2));
                const selected = await send('Request allowed size 3', 'selected-size');
                assert.equal(selected.data.length, 3);
                assert.equal(selected.capabilities.paging.per_page, 2);
                const bounded = await send('Request page 999', 'page-999');
                assert.equal(bounded.requested.paging.current, 2);
                assert.deepEqual(bounded.data, contract.fixture.rows.slice(2));
                await frame.screenshot({ path: resolve(artifacts, `read-${width}-${theme}.png`) });
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await frame
                    .getByText('Ready. Choose a request to start.', { exact: true })
                    .waitFor();
                assert.equal(await example('Actual outgoing request bytes').count(), 0);

                let release;
                let started;
                const held = new Promise((resolve) => {
                    release = resolve;
                });
                const pending = new Promise((resolve) => {
                    started = resolve;
                });
                await page.route('**/dapter/data/**', async (route) => {
                    started();
                    await held;
                    await route.continue().catch(() => {});
                });
                await frame
                    .getByRole('button', { name: 'Read source defaults', exact: true })
                    .click();
                await pending;
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                release();
                await page.unrouteAll({ behavior: 'wait' });
                await frame
                    .getByText('Ready. Choose a request to start.', { exact: true })
                    .waitFor();
                assert.equal(await example('Actual server response bytes').count(), 0);
                assert.equal(requests.length, 4);

                await page.goto(new URL('/docs/dapter/protocol/errors', base).href);
                await frame
                    .getByText('Ready. Choose a failure to inspect.', { exact: true })
                    .waitFor();
                assert.equal(requests.length, 4);
                for (const [label, id] of [
                    ['Send malformed JSON', 'malformed-json'],
                    ['Send version 3', 'future-version'],
                    ['Send a list envelope', 'list-envelope'],
                    ['Request a missing source', 'missing-source'],
                    ['Read an invalid definition', 'server-failure'],
                ]) {
                    const rejected = await send(label, id);
                    assert(!('data' in rejected));
                    assert(!('capabilities' in rejected));
                }
                const geometry = await page.evaluate(() => ({
                    viewport: window.innerWidth,
                    document: document.documentElement.scrollWidth,
                }));
                assert.equal(geometry.document, geometry.viewport);
                await frame.screenshot({
                    path: resolve(artifacts, `errors-${width}-${theme}.png`),
                });
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await frame
                    .getByText('Ready. Choose a failure to inspect.', { exact: true })
                    .waitFor();
                assert.equal(await example('Actual server response bytes').count(), 0);
                assert.equal(requests.length, 9);
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
        'Verified four protocol sessions, exact request and response bytes, CSRF, failures, bounded acknowledgements, cancellation, reset, and zero browser errors.',
    );
} finally {
    await browser.close();
}

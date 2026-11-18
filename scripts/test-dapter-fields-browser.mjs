import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const cases = JSON.parse(
    await readFile(new URL('../app/Demo/Dapter/Fields/cases.json', import.meta.url), 'utf8'),
);
const artifacts = resolve(
    process.env.DAPTER_FIELDS_ARTIFACTS ?? 'storage/app/browser-verification/dapter-fields',
);
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
                locale: 'en-US',
            });
            const errors = [];
            const requests = [];
            const page = await context.newPage();
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (
                    request.method() === 'POST' &&
                    new URL(request.url()).pathname.startsWith('/dapter/data/')
                )
                    requests.push(request);
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            try {
                for (const guide of new Set(cases.map((item) => item.guide))) {
                    const previousReads = requests.length;
                    await page.goto(new URL(`/docs/${guide}`, base).href);
                    const examples = cases.filter((item) => item.guide === guide);
                    await page
                        .locator(`[data-field-scenario="${examples[0].id}"]`)
                        .getByText('Ready. Send the fixed version 2 request to start.', {
                            exact: true,
                        })
                        .waitFor();
                    assert.equal(requests.length, previousReads);
                    for (const example of examples) {
                        const frame = page.locator(`[data-field-scenario="${example.id}"]`);
                        const cookies = await context.cookies();
                        const pending = page.waitForResponse((response) =>
                            new URL(response.url()).pathname.endsWith(
                                `/dapter/data/${example.source}`,
                            ),
                        );
                        await frame
                            .getByRole('button', { name: 'Send request', exact: true })
                            .click();
                        const response = await pending;
                        assert.equal(response.status(), example.expected.status, example.id);
                        assert.deepEqual(
                            JSON.parse(response.request().postData()),
                            example.request,
                        );
                        const headers = await response.request().allHeaders();
                        assert.equal(
                            headers['x-xsrf-token'],
                            decodeURIComponent(
                                cookies.find((cookie) => cookie.name === 'XSRF-TOKEN').value,
                            ),
                        );
                        const body = await response.text();
                        const parsed = JSON.parse(body);
                        if (response.status() === 200) {
                            assert.deepEqual(
                                parsed.data.map((row) => row.id),
                                example.expected.ids,
                            );
                            if (example.expected.driver)
                                assert.deepEqual(
                                    parsed.data.map((row) => row.driver),
                                    example.expected.ids.map(() => example.expected.driver),
                                );
                            assert.equal(parsed.metadata.records.mode, 'unidentified');
                            assert.equal(parsed.metadata.channel, null);
                            assert.equal(parsed.paging.total, 4);
                            assert.equal(parsed.paging.filtered, example.expected.filtered);
                        } else {
                            assert.equal(parsed.error.kind, example.expected.kind ?? 'validation');
                            assert(!('data' in parsed));
                        }
                        await frame
                            .getByRole('button', { name: 'Request and response', exact: true })
                            .click();
                        const output = frame
                            .locator('figure')
                            .filter({
                                has: page
                                    .locator('figcaption')
                                    .getByText('Actual version 2 response', { exact: true }),
                            })
                            .locator('pre code');
                        await output.waitFor();
                        assert.equal(await output.textContent(), body);
                        if (example.empty_request) {
                            const rejected = page.waitForResponse((response) =>
                                new URL(response.url()).pathname.endsWith(
                                    `/dapter/data/${example.source}`,
                                ),
                            );
                            await frame
                                .getByRole('button', {
                                    name: 'Reject empty selection',
                                    exact: true,
                                })
                                .click();
                            const emptyResponse = await rejected;
                            assert.equal(emptyResponse.status(), 422);
                            assert.deepEqual(
                                JSON.parse(emptyResponse.request().postData()),
                                example.empty_request,
                            );
                            assert.equal((await emptyResponse.json()).error.kind, 'validation');
                        }
                        await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                        await frame
                            .getByText('Ready. Send the fixed version 2 request to start.', {
                                exact: true,
                            })
                            .waitFor();
                        assert.equal(await output.count(), 0);
                    }
                    assert.equal(
                        await page.evaluate(() => document.documentElement.scrollWidth),
                        width,
                    );
                    await page.screenshot({
                        path: resolve(
                            artifacts,
                            `${guide.split('/').at(-1)}-${width}-${theme}.png`,
                        ),
                        fullPage: true,
                    });
                }
                assert.deepEqual(errors, []);
                results.push({ width, theme, reads: requests.length, errors });
            } catch (error) {
                await page.screenshot({
                    path: resolve(artifacts, `failure-${width}-${theme}.png`),
                    fullPage: true,
                });
                await writeFile(
                    resolve(artifacts, `failure-${width}-${theme}.json`),
                    JSON.stringify(
                        { url: page.url(), errors, body: await page.locator('body').innerText() },
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
        `Verified ${cases.length} backend field scenarios in four browser sessions, public HTTP responses, CSRF, reset, light and dark themes, and no overflow or browser errors.`,
    );
} finally {
    await browser.close();
}

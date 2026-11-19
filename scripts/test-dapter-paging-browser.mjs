import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve('storage/app/browser-verification/dapter-paging');
await mkdir(artifacts, { recursive: true });
const cases = JSON.parse(await readFile('app/Demo/Dapter/Paging/cases.json', 'utf8'));
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const summary = [];
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
            const page = await context.newPage();
            const errors = [],
                reads = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (request.url().includes('/dapter/data/Dapter.Paging')) reads.push(request);
            });
            const frame = (id) => page.locator(`[data-paging-demo="${id}"]`);
            const capture = (scope, state) =>
                scope.screenshot({
                    path: resolve(artifacts, `${state}-${width}-${theme}.png`),
                });
            const ids = (scope) =>
                scope
                    .locator('[data-paging-row]')
                    .evaluateAll((rows) => rows.map((row) => Number(row.dataset.pagingRow)));
            async function read(scope, label, source, status = 200, action = null) {
                const count = reads.length;
                const pending = page.waitForResponse(
                    (response) =>
                        new URL(response.url()).pathname === `/dapter/data/Dapter.${source}`,
                );
                if (action) await action();
                else await scope.getByRole('button', { name: label, exact: true }).click();
                const response = await pending;
                assert.equal(response.status(), status);
                if (status === 200) {
                    const body = await response.json();
                    await scope.locator(`[data-paging-row="${body.data[0]?.id}"]`).waitFor();
                    await page.waitForFunction(
                        ({ id, count }) =>
                            document
                                .querySelector(`[data-paging-demo="${id}"]`)
                                .querySelectorAll('[data-paging-row]').length === count,
                        { id: source, count: body.data.length },
                    );
                    assert.deepEqual(
                        await ids(scope),
                        body.data.map((row) => row.id),
                    );
                    assert.equal(reads.length, count + 1);
                    return body;
                }
                await scope.locator('[data-paging-error]').waitFor();
                assert.equal(reads.length, count + 1);
                return response.json();
            }
            try {
                for (const guide of new Set(cases.map((item) => item.guide))) {
                    const before = reads.length;
                    await page.goto(new URL(`/docs/${guide}`, base).href);
                    await frame(cases.find((item) => item.guide === guide).id)
                        .getByText('Ready. Start example to read seven fictional notebooks.', {
                            exact: true,
                        })
                        .waitFor();
                    assert.equal(reads.length, before);
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((nodes) => nodes.map((node) => node.src));
                    assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                    for (const example of cases.filter((item) => item.guide === guide)) {
                        const scope = frame(example.id);
                        const initial = await read(scope, 'Start example', example.id);
                        assert.deepEqual(
                            initial.data.map((row) => row.id),
                            [1, 2],
                        );
                        assert.equal(initial.capabilities.paging.counts, example.expected.counts);
                        assert.equal(initial.paging.mode, example.expected.mode);
                        assert.equal(initial.paging.pages, null);
                        assert.equal(
                            initial.paging.total,
                            example.expected.counts === 'exact' ? 7 : null,
                        );
                        await scope
                            .getByText('Numbered action null. Last action null.', { exact: true })
                            .waitFor();
                        const next = await read(scope, 'Next', example.id);
                        assert.deepEqual(
                            next.data.map((row) => row.id),
                            [3, 4],
                        );
                        const previous = await read(scope, 'Previous', example.id);
                        assert.deepEqual(
                            previous.data.map((row) => row.id),
                            [1, 2],
                        );
                        await read(scope, 'Reload', example.id);
                        await read(scope, 'Next', example.id);
                        await read(scope, 'First', example.id);
                        if (example.id === 'PagingRecovery') {
                            await scope
                                .getByRole('button', {
                                    name: 'Advance demonstration time',
                                    exact: true,
                                })
                                .click();
                            await scope
                                .getByText(
                                    'Demonstration time advanced by 901 seconds. Click Next or Reload.',
                                    { exact: true },
                                )
                                .waitFor();
                            const expired = await read(scope, 'Next', example.id, 409);
                            assert.equal(expired.error.recovery, 'restart');
                            assert.deepEqual(await ids(scope), [1, 2]);
                            await capture(scope, `${example.id}-expired`);
                            await read(scope, 'Restart pagination', example.id);
                            await scope
                                .getByRole('button', {
                                    name: 'Change fictional scope',
                                    exact: true,
                                })
                                .click();
                            await scope
                                .getByText('Fictional tenant changed to 2. Click Next or Reload.', {
                                    exact: true,
                                })
                                .waitFor();
                            const invalid = await read(scope, 'Next', example.id, 422);
                            assert.equal(invalid.error.code, 'invalid_cursor');
                            assert.deepEqual(await ids(scope), []);
                            await capture(scope, `${example.id}-scope-invalid`);
                            const recovered = await read(scope, 'Restart pagination', example.id);
                            assert.deepEqual(
                                recovered.data.map((row) => row.tenant),
                                [2, 2],
                            );
                        }
                        await capture(scope, `${example.id}-active`);
                        await scope
                            .getByRole('button', { name: 'Reset example', exact: true })
                            .click();
                        await scope
                            .getByText('Ready. Start example to read seven fictional notebooks.', {
                                exact: true,
                            })
                            .waitFor();
                    }
                    assert.equal(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth,
                        ),
                        false,
                    );
                    await page.screenshot({
                        path: resolve(
                            artifacts,
                            `${guide.split('/').at(-1)}-${width}-${theme}.png`,
                        ),
                        fullPage: true,
                    });
                }
                await page.goto(
                    new URL('/docs/dapter/cursor-paging?neighbor=kept#expected-result', base).href,
                );
                const scope = frame('PagingCursor');
                await read(scope, 'Start example', 'PagingCursor');
                await read(scope, 'Next', 'PagingCursor');
                await page.waitForURL((url) =>
                    url.searchParams.has('dapter_paging_cursor.paging-Dapter.PagingCursor'),
                );
                const saved = page.url();
                assert.equal(new URL(saved).searchParams.get('neighbor'), 'kept');
                assert.equal(new URL(saved).hash, '#expected-result');
                await page.reload();
                const coldResponse = page.waitForResponse(
                    (response) =>
                        response.url().includes('/dapter/data/Dapter.PagingCursor') &&
                        JSON.parse(response.request().postData()).state?.paging.cursor,
                );
                await frame('PagingCursor')
                    .getByRole('button', { name: 'Start example', exact: true })
                    .click();
                const cold = await (await coldResponse).json();
                await frame('PagingCursor').locator('[data-paging-row="3"]').waitFor();
                assert.deepEqual(
                    cold.data.map((row) => row.id),
                    [3, 4],
                );
                const owned = new URL(saved).searchParams.get(
                    'dapter_paging_cursor.paging-Dapter.PagingCursor',
                );
                assert.equal(
                    new URL(page.url()).searchParams.get(
                        'dapter_paging_cursor.paging-Dapter.PagingCursor',
                    ),
                    owned,
                );
                const beforeReject = reads.length,
                    beforeUrl = page.url(),
                    beforeRows = await ids(frame('PagingCursor'));
                await frame('PagingCursor')
                    .getByRole('button', { name: 'Reject page preservation', exact: true })
                    .click();
                await frame('PagingCursor')
                    .locator('[data-local-outcome]')
                    .getByText('validation', { exact: true })
                    .waitFor();
                assert.equal(reads.length, beforeReject);
                assert.equal(page.url(), beforeUrl);
                assert.deepEqual(await ids(frame('PagingCursor')), beforeRows);
                await frame('PagingCursor')
                    .getByRole('button', { name: 'Reject order preset', exact: true })
                    .click();
                await frame('PagingCursor')
                    .locator('[data-local-outcome]')
                    .getByText('validation', { exact: true })
                    .waitFor();
                assert.equal(reads.length, beforeReject);
                assert.equal(page.url(), beforeUrl);
                assert.deepEqual(await ids(frame('PagingCursor')), beforeRows);
                const ordered = await read(
                    frame('PagingCursor'),
                    'Name descending',
                    'PagingCursor',
                );
                assert.equal(ordered.requested.paging.cursor, null);
                const mixed = await read(
                    frame('PagingCursor'),
                    'Append rank ascending',
                    'PagingCursor',
                );
                assert.deepEqual(
                    mixed.requested.order.terms.map((term) => term.direction),
                    ['desc', 'asc'],
                );
                assert.equal(mixed.requested.paging.cursor, null);
                const historyPosition = await read(frame('PagingCursor'), 'Next', 'PagingCursor');
                const historyRows = historyPosition.data.map((row) => row.id);
                await page.waitForFunction((cursor) => {
                    const uuid = new URL(location.href).searchParams.get(
                        'dapter_paging_cursor.paging-Dapter.PagingCursor',
                    );
                    const entry = uuid && JSON.parse(localStorage.getItem(`dapter:state:${uuid}`));
                    return entry?.state.paging.cursor === cursor;
                }, historyPosition.requested.paging.cursor);
                await read(frame('PagingCursor'), 'First', 'PagingCursor');
                await page.waitForFunction(() => {
                    const uuid = new URL(location.href).searchParams.get(
                        'dapter_paging_cursor.paging-Dapter.PagingCursor',
                    );
                    const entry = uuid && JSON.parse(localStorage.getItem(`dapter:state:${uuid}`));
                    return entry?.state.paging.cursor === null;
                });
                const beforeBack = reads.length;
                const back = page.waitForResponse(
                    (response) =>
                        response.url().includes('/dapter/data/Dapter.PagingCursor') &&
                        Boolean(JSON.parse(response.request().postData()).state),
                );
                await page.goBack();
                assert.equal((await back).status(), 200);
                await frame('PagingCursor')
                    .locator(`[data-paging-row="${historyRows[0]}"]`)
                    .waitFor();
                assert.deepEqual(await ids(frame('PagingCursor')), historyRows);
                assert.equal(reads.length, beforeBack + 2);
                assert.deepEqual(JSON.parse(reads[beforeBack].postData()), { version: 2 });
                const beforeForward = reads.length;
                const forward = page.waitForResponse(
                    (response) =>
                        response.url().includes('/dapter/data/Dapter.PagingCursor') &&
                        Boolean(JSON.parse(response.request().postData()).state),
                );
                await page.goForward();
                const forwardResponse = await forward;
                assert.equal(forwardResponse.status(), 200);
                const forwardBody = await forwardResponse.json();
                await scope.locator(`[data-paging-row="${forwardBody.data[0].id}"]`).waitFor();
                assert.deepEqual(
                    await ids(scope),
                    forwardBody.data.map((row) => row.id),
                );
                assert.equal(reads.length, beforeForward + 2);
                assert.deepEqual(JSON.parse(reads[beforeForward].postData()), { version: 2 });
                const searched = await read(scope, 'Search notebooks', 'PagingCursor', 200, () =>
                    scope
                        .getByRole('textbox', { name: 'Notebook name', exact: true })
                        .fill('Notebook 0'),
                );
                assert.equal(searched.requested.paging.cursor, null);
                assert.equal(searched.requested.fields.name.search.value, 'Notebook 0');
                await read(scope, 'Next', 'PagingCursor');
                const resized = await read(
                    scope,
                    'Resize notebooks',
                    'PagingCursor',
                    200,
                    async () => {
                        const select = scope.locator('wa-select[label="Notebooks per page"]');
                        await select.click();
                        await select.locator('wa-option[value="3"]').click();
                    },
                );
                assert.equal(resized.requested.paging.cursor, null);
                assert.equal(resized.paging.per_page, 3);
                assert.equal(resized.data.length, 3);
                assert.equal(resized.requested.fields.name.search.value, 'Notebook 0');
                await capture(scope, 'PagingCursor-search-size');
                assert.deepEqual(errors, []);
                summary.push({ width, theme, cases: cases.length, reads: reads.length, errors });
                console.log(`Verified ${cases.length} paging sources at ${width}px in ${theme}.`);
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
    await writeFile(resolve(artifacts, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    console.log(
        'Verified source paging modes, native SQLite, nullable navigation, counts, explicit expiry and scope recovery, URL restore, and four production layouts.',
    );
} finally {
    await browser.close();
}

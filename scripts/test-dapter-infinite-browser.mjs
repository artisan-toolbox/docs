import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test'), 'Infinite verification requires an isolated .test host.');
const artifacts = resolve('storage/app/browser-verification/dapter-infinite');
await mkdir(artifacts, { recursive: true });
const cases = JSON.parse(await readFile('app/Demo/Dapter/Infinite/cases.json', 'utf8'));
assert.deepEqual(
    cases.map((example) => example.id),
    ['InfiniteSimple', 'InfiniteJoined', 'InfiniteCursor', 'InfiniteRecovery', 'InfiniteFill'],
);
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const summary = [];
try {
    for (const width of [1440, 390]) {
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
            const errors = [];
            const reads = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (/\/dapter\/data\/Dapter\.Infinite/.test(new URL(request.url()).pathname))
                    reads.push(request);
            });
            const frame = (id) => page.locator(`[data-infinite-demo="${id}"]`);
            const rows = (scope) =>
                scope
                    .locator('[data-infinite-row]')
                    .evaluateAll((nodes) => nodes.map((node) => node.dataset.infiniteRow));
            const count = (source) =>
                reads.filter(
                    (request) => new URL(request.url()).pathname === `/dapter/data/${source}`,
                ).length;
            const button = (scope, name) => scope.getByRole('button', { name, exact: true });
            const capture = (scope, name) =>
                scope.screenshot({ path: resolve(artifacts, `${name}-${width}-${theme}.png`) });
            async function expectRows(scope, expected) {
                await page.waitForFunction(
                    ({ id, expected }) =>
                        JSON.stringify(
                            Array.from(
                                document
                                    .querySelector(`[data-infinite-demo="${id}"]`)
                                    .querySelectorAll('[data-infinite-row]'),
                                (node) => node.dataset.infiniteRow,
                            ),
                        ) === JSON.stringify(expected),
                    { id: await scope.getAttribute('data-infinite-demo'), expected },
                );
                assert.deepEqual(await rows(scope), expected);
            }
            async function settled(scope) {
                await page.waitForFunction(
                    (id) => {
                        const text =
                            document.querySelector(
                                `[data-infinite-demo="${id}"] [data-infinite-status]`,
                            )?.textContent ?? '';
                        return /^(idle|paused|exhausted)\./.test(text.trim());
                    },
                    await scope.getAttribute('data-infinite-demo'),
                );
                await page.evaluate(
                    () =>
                        new Promise((resolve) =>
                            requestAnimationFrame(() => requestAnimationFrame(resolve)),
                        ),
                );
            }
            async function unchanged(source, expected, scope, expectedRows) {
                await page.waitForTimeout(450);
                assert.equal(count(source), expected, `${source} must not schedule another read.`);
                if (scope) await expectRows(scope, expectedRows);
            }
            async function read(scope, source, name, expected, status = 200, action = null) {
                const before = count(source);
                const pending = page.waitForResponse(
                    (response) => new URL(response.url()).pathname === `/dapter/data/${source}`,
                );
                await (action ? action() : button(scope, name).click());
                const response = await pending;
                assert.equal(response.status(), status, `${source} ${name}`);
                const body = await response.json();
                await settled(scope);
                await expectRows(scope, expected);
                assert.equal(count(source), before + 1, `${source} ${name} sends one read.`);
                return body;
            }
            async function visit(guide, id, suffix = '') {
                const before = reads.length;
                await page.goto(new URL(`/docs/${guide}${suffix}`, base).href);
                await button(frame(id), 'Start example').waitFor();
                await page.waitForTimeout(100);
                assert.equal(reads.length, before, 'A cold guide waits for reader consent.');
                const scripts = await page
                    .locator('script[src]')
                    .evaluateAll((nodes) => nodes.map((node) => node.src));
                assert(
                    scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)),
                    'Use hashed production assets.',
                );
                assert(
                    !scripts.some((src) => /@vite\/client|localhost:5173|:5173\//.test(src)),
                    'Do not use a Vite development server.',
                );
                return frame(id);
            }
            async function scroll(scope, axis, end) {
                const root = scope.locator('[data-infinite-root]');
                await root.scrollIntoViewIfNeeded();
                await root.evaluate(
                    (node, { axis, end }) => {
                        if (axis === 'x') node.scrollLeft = end ? node.scrollWidth : 0;
                        else node.scrollTop = end ? node.scrollHeight : 0;
                    },
                    { axis, end },
                );
                await page.waitForTimeout(70);
            }
            async function geometry(scope, axis) {
                const size = await scope.locator('[data-infinite-root]').evaluate((node) => ({
                    width: node.clientWidth,
                    scrollWidth: node.scrollWidth,
                    height: node.clientHeight,
                    scrollHeight: node.scrollHeight,
                }));
                assert(
                    axis === 'x' ? size.scrollWidth > size.width : size.scrollHeight > size.height,
                    `The ${axis} root really overflows.`,
                );
                return size;
            }
            async function holdNext(source) {
                let release;
                let arrived;
                const held = new Promise((resolve) => {
                    arrived = resolve;
                });
                const gate = new Promise((resolve) => {
                    release = resolve;
                });
                const pattern = `**/dapter/data/${source}`;
                let intercepted = false;
                const handler = async (route) => {
                    if (intercepted) return route.fallback();
                    intercepted = true;
                    const response = await route.fetch();
                    arrived(response);
                    await gate;
                    try {
                        await route.fulfill({ response });
                    } catch (error) {
                        if (
                            !/canceled|cancelled|closed|disposed|Invalid InterceptionId/i.test(
                                String(error),
                            )
                        )
                            throw error;
                    } finally {
                        await page.unroute(pattern, handler);
                    }
                };
                await page.route(pattern, handler);
                return { held, release };
            }
            try {
                for (const example of cases.filter((item) =>
                    ['InfiniteSimple', 'InfiniteCursor'].includes(item.id),
                )) {
                    const axis = example.id === 'InfiniteCursor' ? 'x' : 'y';
                    const scope = await visit(example.guide, example.id);
                    const first = await read(scope, example.source, 'Start example', ['1', '2']);
                    assert.equal(first.paging.mode, example.expected.mode);
                    const dimensions = await geometry(scope, axis);
                    for (const [label, selector] of [
                        ['Replace scroll root', '[data-infinite-root]'],
                        ['Replace sentinel', '[data-infinite-sentinel]'],
                    ]) {
                        const previous = await scope.locator(selector).elementHandle();
                        const beforeReplace = count(example.source);
                        await button(scope, label).click();
                        assert.equal(await previous.evaluate((node) => node.isConnected), false);
                        await geometry(scope, axis);
                        await unchanged(example.source, beforeReplace, scope, ['1', '2']);
                    }
                    const startUrl = page.url();
                    const before = count(example.source);
                    const gate = await holdNext(example.source);
                    await scroll(scope, axis, true);
                    await gate.held;
                    await capture(scope, `${example.id}-loading`);
                    for (let attempt = 0; attempt < 3; attempt++) {
                        await scroll(scope, axis, false);
                        await scroll(scope, axis, true);
                    }
                    assert.equal(
                        count(example.source),
                        before + 1,
                        `Repeated real intersections share one pending append. ${JSON.stringify(
                            reads
                                .filter(
                                    (request) =>
                                        new URL(request.url()).pathname ===
                                        `/dapter/data/${example.source}`,
                                )
                                .map((request) => request.postDataJSON()),
                        )}`,
                    );
                    await expectRows(scope, ['1', '2']);
                    const beforeAppendScroll = await scope
                        .locator('[data-infinite-root]')
                        .evaluate((node) => ({ x: node.scrollLeft, y: node.scrollTop }));
                    gate.release();
                    await expectRows(scope, ['1', '2', '3', '4']);
                    await settled(scope);
                    await unchanged(example.source, before + 1, scope, ['1', '2', '3', '4']);
                    assert.equal(page.url(), startUrl, 'Append retains the starting URL.');
                    assert.deepEqual(
                        await scope
                            .locator('[data-infinite-root]')
                            .evaluate((node) => ({ x: node.scrollLeft, y: node.scrollTop })),
                        beforeAppendScroll,
                        'Append retains both root scroll offsets.',
                    );
                    await read(scope, example.source, 'Load more', ['1', '2', '3', '4', '5', '6']);
                    await read(scope, example.source, 'Load more', [
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                    ]);
                    await scope
                        .locator('[data-infinite-status]')
                        .getByText('exhausted.', { exact: false })
                        .waitFor();
                    const exhausted = count(example.source);
                    await scroll(scope, axis, false);
                    await scroll(scope, axis, true);
                    await unchanged(example.source, exhausted, scope, [
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                    ]);
                    await capture(scope, `${example.id}-exhausted`);
                    await read(scope, example.source, 'Refresh first page', ['1', '2']);
                    await capture(scope, `${example.id}-refreshed`);
                    summary.push({
                        width,
                        theme,
                        id: example.id,
                        dimensions,
                        checks: [
                            'overflow',
                            'held-boundary',
                            'ordered-append',
                            'exhaustion',
                            'refresh-first',
                        ],
                    });
                }

                const joined = await visit('dapter/infinite-loading', 'InfiniteJoined');
                await read(joined, 'Dapter.InfiniteJoined', 'Start example', ['1:11']);
                await read(joined, 'Dapter.InfiniteJoined', 'Load more', ['1:11', '1:12']);
                await read(joined, 'Dapter.InfiniteJoined', 'Load more', ['1:11', '1:12', '2:21']);
                await capture(joined, 'InfiniteJoined-lossless');

                const recovery = await visit('dapter/infinite-recovery', 'InfiniteRecovery');
                await read(recovery, 'Dapter.InfiniteRecovery', 'Start example', ['1', '2']);
                await button(recovery, 'Fail next read').click();
                await recovery
                    .locator('[data-infinite-fixture-status]')
                    .getByText('The next read fails. Click Load more.', { exact: true })
                    .waitFor();
                await read(recovery, 'Dapter.InfiniteRecovery', 'Load more', ['1', '2'], 500);
                await recovery
                    .locator('[data-infinite-status]')
                    .getByText('paused.', { exact: false })
                    .waitFor();
                await capture(recovery, 'InfiniteRecovery-paused');
                const failed = count('Dapter.InfiniteRecovery');
                await scroll(recovery, 'y', true);
                await scroll(recovery, 'y', false);
                await scroll(recovery, 'y', true);
                await unchanged('Dapter.InfiniteRecovery', failed, recovery, ['1', '2']);
                await button(recovery, 'Allow retry').click();
                await recovery
                    .locator('[data-infinite-fixture-status]')
                    .getByText('The fictional service is available. Click Retry append.', {
                        exact: true,
                    })
                    .waitFor();
                await unchanged('Dapter.InfiniteRecovery', failed, recovery, ['1', '2']);
                await read(recovery, 'Dapter.InfiniteRecovery', 'Retry append', [
                    '1',
                    '2',
                    '3',
                    '4',
                ]);
                await capture(recovery, 'InfiniteRecovery-retried');

                const fill = frame('InfiniteFill');
                const beforeFill = count('Dapter.InfiniteSimple');
                await button(fill, 'Start example').click();
                await fill.locator('[data-infinite-root]').scrollIntoViewIfNeeded();
                await expectRows(fill, ['1', '2', '3', '4', '5', '6']);
                await settled(fill);
                await unchanged('Dapter.InfiniteSimple', beforeFill + 3, fill, [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                ]);
                const visible = await fill.locator('[data-infinite-sentinel]').evaluate((node) => {
                    const root = node.closest('[data-infinite-root]').getBoundingClientRect();
                    const rect = node.getBoundingClientRect();
                    return rect.top < root.bottom && rect.bottom > root.top;
                });
                assert(
                    visible,
                    'The sentinel remains visible after both automatic credits are consumed.',
                );
                await capture(fill, 'InfiniteFill-budget-two');
                await read(fill, 'Dapter.InfiniteSimple', 'Load more', [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                ]);

                const criteria = await visit('dapter/infinite-loading', 'InfiniteSimple');
                await read(criteria, 'Dapter.InfiniteSimple', 'Start example', ['1', '2']);
                await read(criteria, 'Dapter.InfiniteSimple', 'Load more', ['1', '2', '3', '4']);
                const beforeReject = count('Dapter.InfiniteSimple');
                const beforeRejectUrl = page.url();
                await button(criteria, 'Reject page preservation').click();
                await criteria
                    .locator('[data-infinite-local-outcome]')
                    .getByText('validation', { exact: true })
                    .waitFor();
                await unchanged('Dapter.InfiniteSimple', beforeReject, criteria, [
                    '1',
                    '2',
                    '3',
                    '4',
                ]);
                assert.equal(page.url(), beforeRejectUrl);
                const ordered = await read(criteria, 'Dapter.InfiniteSimple', 'Name descending', [
                    '7',
                    '6',
                ]);
                assert.equal(ordered.requested.paging.current, 1);
                const resized = await read(criteria, 'Dapter.InfiniteSimple', 'Set page size 3', [
                    '7',
                    '6',
                    '5',
                ]);
                assert.equal(resized.paging.per_page, 3);
                const searched = await read(
                    criteria,
                    'Dapter.InfiniteSimple',
                    'Search',
                    ['1'],
                    200,
                    () =>
                        criteria
                            .getByRole('textbox', { name: 'Notebook name', exact: true })
                            .fill('Notebook 01'),
                );
                assert.equal(searched.requested.fields.name.search.value, 'Notebook 01');
                await capture(criteria, 'InfiniteSimple-criteria-reset');

                const history = await visit(
                    'dapter/horizontal-infinite-loading',
                    'InfiniteCursor',
                    '?neighbor=kept#expected-result',
                );
                await read(history, 'Dapter.InfiniteCursor', 'Start example', ['1', '2']);
                await read(history, 'Dapter.InfiniteCursor', 'Navigate to next page', ['3', '4']);
                const start = page.url();
                assert.equal(new URL(start).searchParams.get('neighbor'), 'kept');
                assert.equal(new URL(start).hash, '#expected-result');
                await read(history, 'Dapter.InfiniteCursor', 'Load more', ['3', '4', '5', '6']);
                assert.equal(page.url(), start);
                const beforeCold = reads.length;
                await page.reload();
                await button(frame('InfiniteCursor'), 'Start example').waitFor();
                assert.equal(reads.length, beforeCold);
                const coldUrl = page.url();
                const restoredUrl = new URL(coldUrl);
                const originalUrl = new URL(start);
                restoredUrl.searchParams.sort();
                originalUrl.searchParams.sort();
                assert.equal(restoredUrl.href, originalUrl.href);
                await read(frame('InfiniteCursor'), 'Dapter.InfiniteCursor', 'Start example', [
                    '3',
                    '4',
                ]);
                assert.equal(page.url(), coldUrl);
                await read(frame('InfiniteCursor'), 'Dapter.InfiniteCursor', 'Refresh first page', [
                    '1',
                    '2',
                ]);
                await read(
                    frame('InfiniteCursor'),
                    'Dapter.InfiniteCursor',
                    'Navigate to next page',
                    ['3', '4'],
                );
                const previousUrl = page.url();
                await read(
                    frame('InfiniteCursor'),
                    'Dapter.InfiniteCursor',
                    'Navigate to next page',
                    ['5', '6'],
                );
                const nextUrl = page.url();
                const back = page.waitForResponse(
                    (response) =>
                        new URL(response.url()).pathname === '/dapter/data/Dapter.InfiniteCursor',
                );
                await page.goBack();
                assert.equal((await back).status(), 200);
                await expectRows(frame('InfiniteCursor'), ['3', '4']);
                assert.equal(page.url(), previousUrl);
                const forward = page.waitForResponse(
                    (response) =>
                        new URL(response.url()).pathname === '/dapter/data/Dapter.InfiniteCursor',
                );
                await page.goForward();
                assert.equal((await forward).status(), 200);
                await expectRows(frame('InfiniteCursor'), ['5', '6']);
                assert.equal(page.url(), nextUrl);
                assert.equal(new URL(page.url()).searchParams.get('neighbor'), 'kept');
                assert.equal(new URL(page.url()).hash, '#expected-result');
                await capture(frame('InfiniteCursor'), 'InfiniteCursor-history');

                for (const action of ['Name descending', 'Reset example']) {
                    const scope = await visit('dapter/infinite-loading', 'InfiniteSimple');
                    await read(scope, 'Dapter.InfiniteSimple', 'Start example', ['1', '2']);
                    const gate = await holdNext('Dapter.InfiniteSimple');
                    await button(scope, 'Load more').click();
                    await gate.held;
                    if (action === 'Name descending')
                        await read(scope, 'Dapter.InfiniteSimple', action, ['7', '6']);
                    else {
                        await button(scope, action).click();
                        await button(scope, 'Start example').waitFor();
                    }
                    gate.release();
                    await unchanged(
                        'Dapter.InfiniteSimple',
                        count('Dapter.InfiniteSimple'),
                        scope,
                        action === 'Name descending' ? ['7', '6'] : [],
                    );
                    await capture(
                        scope,
                        action === 'Name descending'
                            ? 'InfiniteSimple-stale-criteria'
                            : 'InfiniteSimple-disposed',
                    );
                }
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
                    false,
                    'The document does not overflow horizontally.',
                );
                assert.deepEqual(errors, []);
                summary.push({
                    width,
                    theme,
                    reads: reads.length,
                    checks: [
                        'reader-consent',
                        'joined-tuples',
                        'failure-pause',
                        'explicit-retry',
                        'bounded-fill',
                        'criteria-reset',
                        'url-start',
                        'cold-restore',
                        'history',
                        'stale-criteria',
                        'disposal',
                    ],
                    errors,
                });
                console.log(`Verified infinite loading at ${width}px in ${theme}.`);
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
    }
    await writeFile(resolve(artifacts, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
    console.log(
        'Verified guarded infinite loading through actual HTTP fixtures and four production layouts.',
    );
} finally {
    await browser.close();
}

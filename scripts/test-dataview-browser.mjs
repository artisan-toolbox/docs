import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
const installed = JSON.parse(
    await readFile(new URL('../vendor/composer/installed.json', import.meta.url), 'utf8'),
);
const frontAwesome = installed.packages.find(
    (item) => item.name === 'artisan-toolbox/front-awesome',
);
assert(frontAwesome, 'Run Composer before the browser checks.');
const expectedApi =
    process.env.DATA_VIEW_EXPECT_API ??
    (frontAwesome.version.replace(/^v/, '') === '1.0.0-beta.3' ? 'base' : 'candidate');
assert(
    ['base', 'candidate'].includes(expectedApi),
    'DATA_VIEW_EXPECT_API accepts base or candidate.',
);
const results = [];
const sourceResponse = (source) => (response) =>
    new URL(response.url()).pathname.endsWith(`/dapter/data/${source}`);
async function read(page, scope, label, source, gesture = 'click') {
    const [response] = await Promise.all([
        page.waitForResponse(sourceResponse(source)),
        scope.getByRole('button', { name: label, exact: true })[gesture]({ timeout: 10000 }),
    ]);
    assert.equal(response.status(), 200);
    await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `Page overflow after ${label}`,
    );
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
                locale: 'pt-BR',
                hasTouch: width === 390,
                ignoreHTTPSErrors: true,
            });
            const page = await context.newPage();
            const errors = [],
                reads = [],
                fixtureOperations = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                const path = new URL(request.url()).pathname;
                if (path.startsWith('/dapter/data/')) reads.push(request);
                if (
                    path.startsWith('/demo/dapter/') ||
                    (['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method()) &&
                        path.startsWith('/dapter/actions/'))
                )
                    fixtureOperations.push(request.method() + ' ' + path);
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            try {
                async function openGuide(path) {
                    const before = reads.length;
                    const beforeOperations = fixtureOperations.length;
                    await page.goto(
                        new URL('/docs/front-awesome/data-view' + (path ? '/' + path : ''), base)
                            .href,
                    );
                    await page.locator('article [data-document-content]').waitFor();
                    if (process.env.DATA_VIEW_EXPECT_PRODUCTION === '1') {
                        const scripts = await page
                            .locator('script[src]')
                            .evaluateAll((items) => items.map((item) => item.src));
                        assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                        assert(!scripts.some((src) => src.includes('/@vite/client')));
                    }
                    assert.equal(reads.length, before, 'Reading a guide started an adapter');
                    assert.equal(
                        fixtureOperations.length,
                        beforeOperations,
                        'Reading a guide started a fixture operation: ' +
                            fixtureOperations.slice(beforeOperations).join(', '),
                    );
                    assert.equal(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth,
                        ),
                        false,
                    );
                }
                if (expectedApi === 'candidate') {
                    await openGuide('');
                    const translated = page.getByTestId('data-view-first');
                    await read(page, translated, 'Start example', 'Dapter.Quickstart');
                    await translated
                        .getByRole('button', { name: 'Próxima', exact: true })
                        .waitFor();
                    await translated.getByText('Página 1 de 3', { exact: true }).waitFor();
                }
                await page.goto(new URL('/docs/front-awesome/preferences', base).href);
                await page
                    .locator('[data-preferences-demo]')
                    .getByLabel('Language', { exact: true })
                    .selectOption('en');
                await page.waitForFunction(() => document.documentElement.lang === 'en');
                await openGuide('');
                assert.equal(await page.locator('html').getAttribute('lang'), 'en');
                const first = page.getByTestId('data-view-first');
                const initial = await read(page, first, 'Start example', 'Dapter.Quickstart');
                assert.equal(initial.body.paging.total, 23);
                assert.equal(initial.body.data.length, 10);
                const nextFirst = await read(page, first, 'Next', 'Dapter.Quickstart');
                assert.equal(nextFirst.body.data[0].name, 'Notebook 11');
                await first.getByRole('cell', { name: 'Notebook 11', exact: true }).waitFor();
                await openGuide('layouts');
                const layoutReads = reads.length;
                const main = page.getByTestId('data-view-demo');
                await main.getByText('No source is running.', { exact: true }).waitFor();
                assert.equal(reads.length, layoutReads);
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
                await main.getByRole('status').filter({ hasText: 'Updating results…' }).waitFor();
                await main.getByRole('button', { name: 'Grid', exact: true }).click();
                await main.locator('li wa-card').filter({ hasText: 'Notebook 01' }).waitFor();
                release();
                assert.equal((await pending).status(), 200);
                await main.locator('li wa-card').filter({ hasText: 'Notebook 06' }).waitFor();
                await main.getByRole('button', { name: 'List', exact: true }).click();
                await main.locator('li strong').filter({ hasText: 'Notebook 06' }).waitFor();
                await main.getByRole('button', { name: 'Table', exact: true }).click();
                await main.locator('tbody strong').filter({ hasText: 'Notebook 06' }).waitFor();
                assert.equal(reads.length - layoutReads, 2);
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
                assert.equal(reads.length - layoutReads, 2);
                await main.getByRole('button', { name: 'Reset', exact: true }).click();
                const denied = page.waitForResponse(sourceResponse('Dapter.CollectionGateDeny'));
                await main.getByRole('button', { name: 'Try denied source', exact: true }).click();
                assert.equal((await denied).status(), 403);
                await main
                    .getByRole('alert')
                    .filter({ hasText: /denied/i })
                    .waitFor();
                assert.equal(await main.locator('tbody tr').count(), 0);

                if (expectedApi === 'base') {
                    for (const [path, frames] of [
                        ['query-controls', ['[data-testid="data-view-query"]']],
                        ['ordering', ['[data-comparison="locale"]']],
                        [
                            'selection',
                            [
                                '[data-testid="data-view-groups"]',
                                '[data-testid="data-view-join"]',
                                '[data-testid="data-view-context"]',
                            ],
                        ],
                        ['live-updates', ['[data-live-mode="polling"]', '[data-live-mode="push"]']],
                    ]) {
                        await openGuide(path);
                        for (const frame of frames) {
                            const scope = page.locator(frame);
                            await scope.locator('[data-data-view-preview-required]').waitFor();
                            assert.equal(
                                await scope.getByRole('button', { name: /^Start/ }).count(),
                                0,
                            );
                        }
                    }
                    await openGuide('ordering');
                    const releasedCatalog = page.getByTestId('data-view-capabilities');
                    await read(
                        page,
                        releasedCatalog,
                        'Start capabilities',
                        'Dapter.ComposedCatalog',
                    );
                    const preset = page.waitForResponse(sourceResponse('Dapter.ComposedCatalog'));
                    await choose(releasedCatalog, 'Order results', 'Newest first');
                    assert.equal(
                        JSON.parse((await preset).request().postData()).state.order.id,
                        'reverse',
                    );
                    await openGuide('paging');
                    const releasedRecovery = page.locator(
                        '[data-paging-demo="Dapter.InfiniteRecovery"]',
                    );
                    await read(
                        page,
                        releasedRecovery,
                        'Start traversal',
                        'Dapter.InfiniteRecovery',
                    );
                    await releasedRecovery
                        .getByRole('button', { name: 'Pause fictional service' })
                        .click();
                    await releasedRecovery
                        .getByText('The next read will fail.', { exact: true })
                        .waitFor();
                    const failed = page.waitForResponse(sourceResponse('Dapter.InfiniteRecovery'));
                    await releasedRecovery.getByRole('button', { name: 'Load more' }).click();
                    assert((await failed).status() >= 400);
                    await releasedRecovery.getByRole('button', { name: 'Allow retry' }).click();
                    await releasedRecovery
                        .getByText('The fictional service recovered. Retry the append.', {
                            exact: true,
                        })
                        .waitFor();
                    await read(
                        page,
                        releasedRecovery,
                        'Retry loading more',
                        'Dapter.InfiniteRecovery',
                    );
                    const simple = page.locator('[data-paging-demo="Dapter.PagingSimple"]');
                    await read(page, simple, 'Start traversal', 'Dapter.PagingSimple');
                    await read(page, simple, 'Next', 'Dapter.PagingSimple');
                    await openGuide('actions');
                    const action = page.getByTestId('data-view-actions');
                    await read(page, action, 'Start protocol 1', 'FrontAwesome.NotebookActions');
                    await action.getByRole('button', { name: 'Save record 1' }).click();
                    await action
                        .locator('[data-action-outcome]')
                        .filter({ hasText: 'completed. Commit confirmed' })
                        .waitFor();
                    assert.deepEqual(errors, []);
                    results.push({
                        width,
                        theme,
                        expectedApi,
                        assertions:
                            'Published first table, layouts, simple paging, protocol 1 write, visible candidate prerequisites, and zero automatic reads.',
                    });
                    continue;
                }

                await openGuide('query-controls');
                const query = page.getByTestId('data-view-query');
                await read(page, query, 'Start example', 'FrontAwesome.Notebooks');
                const disclosure = query.getByRole('button', {
                    name: 'Search and filters',
                    exact: true,
                });
                await disclosure.focus();
                await disclosure.press('Enter');
                assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
                const markGroup = query.getByRole('group', { name: 'mark', exact: true });
                for (const [label, value, expected] of [
                    ['Null', null, 1],
                    ['boolean: false', false, 2],
                    ['number: 0', 0, 3],
                    ['string: 0', '0', 4],
                    ['Empty string', '', 5],
                    ['One space', ' ', 6],
                ]) {
                    await choose(markGroup, 'mark', label);
                    const result = await read(page, markGroup, 'Apply', 'FrontAwesome.Notebooks');
                    assert.equal(result.request.state.global.filters.mark.value, value);
                    assert.deepEqual(
                        result.body.data.map((row) => row.id),
                        [expected],
                    );
                    await query
                        .getByRole('cell', { name: result.body.data[0].name, exact: true })
                        .waitFor();
                }
                await read(page, markGroup, 'Clear', 'FrontAwesome.Notebooks');
                const name = query.getByRole('group', { name: 'Search name', exact: true });
                await choose(name, 'Match operator', 'Equals');
                await name.getByRole('textbox').fill('Notebook 2');
                const fieldRead = await read(page, name, 'Apply', 'FrontAwesome.Notebooks');
                assert.equal(fieldRead.request.state.fields.name.search.matchType, 'equals');
                assert.deepEqual(
                    fieldRead.body.data.map((row) => row.id),
                    [2],
                );
                const waitStock = () =>
                    page.waitForResponse(sourceResponse('FrontAwesome.Notebooks'));
                const [all] = await Promise.all([
                    waitStock(),
                    query.getByRole('textbox', { name: 'Search results', exact: true }).fill('C'),
                ]);
                assert.equal(JSON.parse(all.request().postData()).state.searchMatch, 'all');
                assert.deepEqual((await all.json()).data, []);
                const [any] = await Promise.all([
                    waitStock(),
                    choose(query, 'Combine searches', 'Any'),
                ]);
                assert.equal(JSON.parse(any.request().postData()).state.searchMatch, 'any');
                assert.deepEqual(
                    (await any.json()).data.map((row) => row.id),
                    [2, 5, 6],
                );
                await read(page, query, 'Reset to source defaults', 'FrontAwesome.Notebooks');
                const sheets = query.getByRole('group', {
                    name: 'Search Sheet count',
                    exact: true,
                });
                await sheets.getByRole('textbox').fill('24');
                const stock = await read(page, sheets, 'Apply', 'FrontAwesome.Notebooks');
                assert.equal(stock.request.state.fields.sheets.search.value, 24);
                assert.deepEqual(
                    stock.body.data.map((row) => row.id),
                    [2],
                );
                await read(page, sheets, 'Clear', 'FrontAwesome.Notebooks');
                const allowed = query.getByRole('group', {
                    name: 'Allowed stock marks',
                    exact: true,
                });
                const beforeEmpty = reads.length;
                await allowed.getByRole('button', { name: 'Apply', exact: true }).click();
                await allowed.getByText('Choose an option.', { exact: true }).waitFor();
                assert.equal(reads.length, beforeEmpty);
                await name.getByRole('button', { name: 'Apply', exact: true }).press('Escape');
                assert.equal(
                    await disclosure.evaluate(
                        (node) => node === document.activeElement || node.matches(':focus'),
                    ),
                    true,
                );

                const literal = page.locator('[data-comparison="literal"]');
                await read(page, literal, 'Start example', 'Dapter.LiteralStrictFluent');
                await literal.getByRole('button', { name: 'Search and filters' }).click();
                const exact = literal.getByRole('group', { name: 'Search name', exact: true });
                await exact.getByRole('textbox').fill('joao');
                const literalResult = await read(
                    page,
                    exact,
                    'Apply',
                    'Dapter.LiteralStrictFluent',
                );
                assert.deepEqual(
                    literalResult.body.data.map((row) => row.id),
                    [7],
                );
                await openGuide('selection');
                const group = page.getByTestId('data-view-groups');
                await read(page, group, 'Start example', 'FrontAwesome.Notebooks');
                const groupCells = group.locator('th[scope="rowgroup"]');
                await groupCells.first().waitFor();
                assert.deepEqual(
                    await groupCells.evaluateAll((elements) =>
                        elements.map((cell) => [cell.textContent.trim(), cell.rowSpan]),
                    ),
                    [
                        ['A', 2],
                        ['B', 1],
                        ['A', 1],
                    ],
                );
                const selectionReads = reads.length;
                const picked = group.getByRole('checkbox', {
                    name: 'Select Notebook 10',
                    exact: true,
                });
                await picked.focus();
                await picked.press('Space');
                assert(await picked.isChecked());
                assert(
                    await group
                        .getByRole('checkbox', { name: 'Select all loaded rows' })
                        .evaluate((input) => input.indeterminate),
                );
                await group.getByRole('button', { name: 'List', exact: true }).click();
                assert(
                    await group.getByRole('checkbox', { name: 'Select Notebook 10' }).isChecked(),
                );
                assert.equal(reads.length, selectionReads);
                await read(page, group, 'Next', 'FrontAwesome.Notebooks');
                await group
                    .locator('[data-picked]')
                    .getByText('Selected []. Current rows none.', { exact: true })
                    .waitFor();
                const join = page.getByTestId('data-view-join');
                await read(page, join, 'Start example', 'Dapter.ComposedJoin');
                await join.getByRole('radio', { name: 'Select Notebook line 11' }).check();
                await join.getByRole('radio', { name: 'Select Notebook line 12' }).check();
                assert.equal(
                    await join.getByRole('radio', { name: 'Select Notebook line 11' }).isChecked(),
                    false,
                );

                const scoped = page.getByTestId('data-view-context');
                await read(page, scoped, 'Start example', 'FrontAwesome.Notebooks');
                await scoped
                    .locator('[data-context-selection]')
                    .filter({ hasText: 'Notebook 10' })
                    .waitFor();
                const forbidden = page.waitForResponse(sourceResponse('Dapter.CollectionGateDeny'));
                await scoped
                    .getByRole('button', { name: 'Withdraw access and hold old prefill' })
                    .click();
                assert.equal((await forbidden).status(), 403);
                await read(page, scoped, 'Load overlapping keys', 'Dapter.Quickstart');
                await scoped.getByRole('cell', { name: 'Notebook 01', exact: true }).waitFor();
                assert.equal(
                    await scoped
                        .getByRole('checkbox', { name: 'Select row 1', exact: true })
                        .isChecked(),
                    false,
                );
                assert((await scoped.locator('[data-parent-keys]').textContent()).includes('[1]'));
                await scoped.getByRole('button', { name: 'Acknowledge removal' }).click();
                await scoped.getByRole('checkbox', { name: 'Select row 1', exact: true }).check();
                await read(page, scoped, 'Start a fresh owner', 'FrontAwesome.Notebooks');
                assert((await scoped.locator('[data-parent-keys]').textContent()).includes('[]'));
                await openGuide('ordering');
                const capabilities = page.getByTestId('data-view-capabilities');
                await read(page, capabilities, 'Start capabilities', 'Dapter.ComposedCatalog');
                await capabilities
                    .locator('[data-capability-state]')
                    .filter({ hasText: 'Shared handle yes' })
                    .waitFor();
                assert.equal(
                    await capabilities
                        .locator('[data-head-direction]')
                        .getAttribute('data-head-direction'),
                    '0',
                );
                assert.equal(
                    await capabilities.locator('[data-head-unavailable]').textContent(),
                    'Unavailable',
                );
                const quantityIcon = capabilities
                    .getByRole('columnheader', { name: 'Quantity', exact: true })
                    .locator('wa-icon');
                assert.equal(await quantityIcon.evaluate((icon) => icon.name), 'sort');
                const multiKey = await page.evaluate(() =>
                    /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Meta' : 'Control',
                );
                async function headerOrder(label, multi = false) {
                    const pending = page.waitForResponse(sourceResponse('Dapter.ComposedCatalog'));
                    await capabilities
                        .getByRole('button', { name: label, exact: true })
                        .click({ modifiers: multi ? [multiKey] : [] });
                    const result = await pending;
                    assert.equal(result.status(), 200);
                    const body = await result.json();
                    await page.evaluate(
                        () =>
                            new Promise((done) =>
                                requestAnimationFrame(() => requestAnimationFrame(done)),
                            ),
                    );
                    return body.requested.order;
                }
                assert.deepEqual(
                    (await headerOrder('Notebook', true)).terms.map((term) => term.field),
                    ['name'],
                );
                assert.deepEqual(
                    (await headerOrder('Quantity', true)).terms.map((term) => term.field),
                    ['name', 'quantity'],
                );
                assert.deepEqual(await headerOrder('Notebook'), {
                    kind: 'fields',
                    terms: [{ field: 'name', direction: 'desc', sortType: 'native' }],
                });
                assert.equal(
                    await capabilities
                        .locator('[data-head-direction]')
                        .getAttribute('data-head-direction'),
                    '-1',
                );
                await headerOrder('Quantity', true);
                assert.deepEqual(await headerOrder('Notebook'), {
                    kind: 'fields',
                    terms: [{ field: 'name', direction: 'asc', sortType: 'native' }],
                });
                assert.equal(
                    await capabilities
                        .locator('[data-head-direction]')
                        .getAttribute('data-head-direction'),
                    '1',
                );
                await quantityIcon.waitFor();
                await page.waitForFunction(() =>
                    Array.from(document.querySelectorAll('[data-capability-session] wa-icon')).some(
                        (icon) => icon.name === 'sort' && icon.shadowRoot?.querySelector('svg'),
                    ),
                );
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
                await choose(capabilities, 'Order preset', 'Newest first');
                assert.deepEqual(JSON.parse((await presetRead).request().postData()).state.order, {
                    kind: 'preset',
                    id: 'reverse',
                });
                await capabilities.getByRole('button', { name: 'Ordering', exact: true }).click();
                const byName = capabilities.getByRole('group', { name: 'name', exact: true });
                await choose(byName, 'Sort type', 'Natural');
                const firstTerm = await read(
                    page,
                    byName,
                    'Replace order',
                    'Dapter.ComposedCatalog',
                );
                assert.equal(firstTerm.request.state.order.terms[0].sortType, 'natural');
                const byQuantity = capabilities.getByRole('group', {
                    name: 'quantity',
                    exact: true,
                });
                await choose(byQuantity, 'Sort type', 'Numeric');
                await choose(byQuantity, 'Direction', 'Descending');
                const terms = await read(
                    page,
                    byQuantity,
                    'Add to order',
                    'Dapter.ComposedCatalog',
                    width === 390 ? 'tap' : 'click',
                );
                assert.deepEqual(
                    terms.request.state.order.terms.map((term) => [
                        term.field,
                        term.sortType,
                        term.direction,
                    ]),
                    [
                        ['name', 'natural', 'asc'],
                        ['quantity', 'numeric', 'desc'],
                    ],
                );
                const rank = capabilities.getByRole('group', { name: 'rank', exact: true });
                assert.equal(await rank.getByRole('button', { name: 'Add to order' }).count(), 0);
                await read(
                    page,
                    capabilities.getByRole('group', { name: /quantity.*Priority 2/ }),
                    'Remove term',
                    'Dapter.ComposedCatalog',
                );
                const locale = page.locator('[data-comparison="locale"]');
                await read(page, locale, 'Start example', 'Dapter.ComparisonsLocaleFluent');
                await locale.getByRole('button', { name: 'Ordering', exact: true }).click();
                const localeOrder = locale.getByRole('group', { name: 'name', exact: true });
                await choose(localeOrder, 'Sort type', 'Locale');
                const collated = await read(
                    page,
                    localeOrder,
                    'Replace order',
                    'Dapter.ComparisonsLocaleFluent',
                );
                assert.deepEqual(
                    collated.body.data.map((row) => row.id),
                    [4, 3, 1, 2, 6, 5],
                );
                await capabilities.screenshot({
                    path: resolve(artifacts, `${width}-${theme}-capabilities.png`),
                });

                await openGuide('actions');
                const action = page.getByTestId('data-view-actions');
                await read(page, action, 'Start actions', 'FrontAwesome.NotebookActions');
                const write = page.waitForResponse((response) =>
                    response.url().includes('/dapter/actions/'),
                );
                await action
                    .getByRole('button', { name: 'Save fictional notebook', exact: true })
                    .click();
                assert.equal((await write).status(), 200);
                await action
                    .locator('[data-action-outcome]')
                    .filter({ hasText: 'Outcome completed. Commit confirmed' })
                    .waitFor();
                await read(page, action, 'Reload write counter', 'FrontAwesome.NotebookActions');

                const targetWrite = page.waitForResponse((response) =>
                    response
                        .url()
                        .includes('/dapter/actions/FrontAwesome.NotebookActions/record/1'),
                );
                await action.getByRole('button', { name: 'Save record 1' }).click();
                const written = await targetWrite;
                assert.equal(written.status(), 200);
                assert.equal(JSON.parse(written.request().postData()).recordId, 1);
                assert.equal(
                    await action.getByRole('button', { name: 'Save record 2' }).count(),
                    0,
                );
                for (const [command, outcome] of [
                    ['Reject before dispatch', 'rejected. Commit not_started'],
                    ['Return validation after writing', 'validation. Commit unknown'],
                    ['Fail after writing', 'failed. Commit unknown'],
                    ['Cancel the HTTP request', 'cancelled. Commit unknown'],
                ]) {
                    await action.getByRole('button', { name: command, exact: true }).click();
                    await action
                        .locator('[data-action-outcome]')
                        .filter({ hasText: outcome })
                        .waitFor();
                }
                await read(page, action, 'Revoke permission', 'FrontAwesome.NotebookActions');
                assert.equal(await action.locator('[data-action-outcome]').count(), 0);
                await openGuide('paging');
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
                const recovery = page.locator('[data-paging-demo="Dapter.PagingRecovery"]');
                await read(page, recovery, 'Start traversal', 'Dapter.PagingRecovery');
                await read(page, recovery, 'Next', 'Dapter.PagingRecovery');
                await recovery.getByRole('button', { name: 'Expire fictional token' }).click();
                await recovery
                    .getByText('The clock advanced. Traverse with the previous token.', {
                        exact: true,
                    })
                    .waitFor();
                const invalid = page.waitForResponse(sourceResponse('Dapter.PagingRecovery'));
                await recovery.getByRole('button', { name: 'Next', exact: true }).click();
                assert.equal((await (await invalid).json()).error.kind, 'cursor_expired');
                await read(page, recovery, 'Restart from first page', 'Dapter.PagingRecovery');
                await recovery.getByRole('button', { name: 'Change cursor scope' }).click();
                await recovery
                    .getByText('The scope changed. Traverse with the previous token.', {
                        exact: true,
                    })
                    .waitFor();
                const stale = page.waitForResponse(sourceResponse('Dapter.PagingRecovery'));
                await recovery.getByRole('button', { name: 'Next', exact: true }).click();
                assert.equal((await (await stale).json()).error.code, 'invalid_cursor');
                await read(page, recovery, 'Restart from first page', 'Dapter.PagingRecovery');
                const append = page.locator('[data-paging-demo="Dapter.InfiniteRecovery"]');
                await read(page, append, 'Start traversal', 'Dapter.InfiniteRecovery');
                await append.getByRole('button', { name: 'Pause fictional service' }).click();
                await append.getByText('The next read will fail.', { exact: true }).waitFor();
                const failedAppend = page.waitForResponse(
                    sourceResponse('Dapter.InfiniteRecovery'),
                );
                await append.getByRole('button', { name: 'Load more' }).click();
                assert((await failedAppend).status() >= 400);
                assert.equal(await append.locator('tbody tr').count(), 2);
                await append.getByRole('button', { name: 'Allow retry' }).click();
                await append
                    .getByText('The fictional service recovered. Retry the append.', {
                        exact: true,
                    })
                    .waitFor();
                await read(page, append, 'Retry loading more', 'Dapter.InfiniteRecovery');
                await append.getByRole('cell', { name: 'Notebook 04', exact: true }).waitFor();
                for (const lastRow of ['Notebook 06', 'Notebook 07']) {
                    await read(page, append, 'Load more', 'Dapter.InfiniteRecovery');
                    await append.getByRole('cell', { name: lastRow, exact: true }).waitFor();
                }
                await append.getByText('All available results loaded.', { exact: true }).waitFor();
                const observed = page.locator('[data-paging-demo="observed"]');
                await read(page, observed, 'Start traversal', 'Dapter.InfiniteSimple');
                const window = observed.getByRole('region', { name: 'Notebook scroll window' });
                await window.getByRole('cell', { name: 'Notebook 01', exact: true }).waitFor();
                const appended = page.waitForResponse(sourceResponse('Dapter.InfiniteSimple'));
                await window.evaluate((element) => {
                    element.scrollTop = element.scrollHeight;
                });
                await appended;
                await window.getByRole('cell', { name: 'Notebook 03', exact: true }).waitFor();

                await openGuide('adapter-state');
                const owner = page.getByTestId('data-view-owner');
                await read(page, owner, 'Start example', 'Dapter.VueCatalog');
                const scroll = owner.locator('[data-owner-scroll]');
                await scroll.evaluate((node) => {
                    node.scrollTop = 45;
                });
                assert.equal(await scroll.evaluate((node) => node.scrollTop), 45);
                await read(page, owner, 'Next saved page', 'Dapter.VueCatalog');
                await page.waitForURL((url) =>
                    url.searchParams.has('saved_catalog.saved-notebooks'),
                );
                await page.waitForFunction(
                    () => document.querySelector('[data-owner-scroll]')?.scrollTop === 0,
                );
                const backRead = page.waitForResponse(sourceResponse('Dapter.VueCatalog'));
                await page.goBack();
                await backRead;
                await page.waitForFunction(
                    () => document.querySelector('[data-owner-scroll]')?.scrollTop === 45,
                );
                const snap = await read(
                    page,
                    owner,
                    'Use saved paper snapshot',
                    'Dapter.VueCatalog',
                );
                assert.deepEqual(
                    snap.body.data.map((row) => row.category),
                    ['paper', 'paper'],
                );
                await owner.getByRole('listitem').filter({ hasText: 'Notebook 2' }).waitFor();
                const beforeShare = page.url();
                await owner.getByRole('button', { name: 'Create share URL', exact: true }).click();
                const shared = new URL(await owner.locator('[data-share-url]').innerText());
                assert(shared.searchParams.get('saved_catalog.saved-notebooks').startsWith('s1.'));
                assert.equal(page.url(), beforeShare);
                await read(page, owner, 'Restore server defaults', 'Dapter.VueCatalog');

                await openGuide('live-updates');
                const live = page.locator('[data-live-mode="polling"]');
                await read(page, live, 'Start example', 'FrontAwesome.PollingNotebooks');
                await live.getByRole('radio').first().check();
                await live.getByRole('button', { name: 'Change fixture', exact: true }).click();
                await live
                    .locator('[data-live-selection]')
                    .filter({ hasText: 'Changed notebook 2' })
                    .waitFor();
                await live.getByRole('button', { name: 'Revoke access' }).click();
                await live.getByRole('alert').first().waitFor();
                assert.equal(await live.getByRole('radio').count(), 0);
                assert(
                    !(await live.locator('[data-live-selection]').textContent()).includes(
                        'Changed notebook',
                    ),
                );
                await openGuide('reference');
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

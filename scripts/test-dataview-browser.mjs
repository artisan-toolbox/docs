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
    const control = scope.getByRole('combobox', { name: label, exact: true });
    await control.click({ timeout: 10000 });
    const choice = scope.page().getByRole('option', { name: option, exact: true });
    await choice.click({ timeout: 10000 });
    await choice.waitFor({ state: 'hidden', timeout: 10000 });
}
function optionsButton(scope) {
    return scope.getByRole('button', { name: 'View options', exact: true });
}
async function openOptions(scope, section) {
    const dialog = scope.getByRole('dialog', { name: 'View options', exact: true });
    const trigger = optionsButton(scope);
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
    await dialog.waitFor();
    const navigation = scope.getByRole('button', { name: section, exact: true });
    await navigation.click();
    return dialog;
}
async function chooseLayout(scope, name) {
    const layouts = scope.getByRole('group', { name: 'Results layout', exact: true });
    await layouts.getByRole('button', { name, exact: true }).click();
}
async function waitForTrigger(page, trigger) {
    await page.waitForFunction((button) => button.matches(':focus'), await trigger.elementHandle());
}
async function captureDemo(page, frame, width, filename) {
    const path = resolve(artifacts, filename);
    if (width !== 390) {
        await frame.screenshot({ path });
        return;
    }
    await frame.evaluate((element) => {
        element.scrollIntoView({ block: 'start', behavior: 'instant' });
        const header = document.querySelector('header[slot="header"]');
        window.scrollBy({
            top:
                element.getBoundingClientRect().top -
                (header?.getBoundingClientRect().height ?? 0) -
                8,
            behavior: 'instant',
        });
    });
    await page.screenshot({ path });
}

async function verifyTableFeedback(page, width, theme) {
    const demo = page.getByTestId('table-feedback');
    const open = demo.getByRole('button', { name: 'Open notebook catalog', exact: true });
    if (!(await open.count())) {
        await demo.getByText(/requires Front Awesome beta.10 or later/).waitFor();
        return;
    }
    const inventory = demo.getByRole('region', { name: 'Notebook inventory', exact: true }).first();
    const source = 'FrontAwesome.Notebooks';
    const screenshot = (state) =>
        inventory.screenshot({ path: resolve(artifacts, `${width}-${theme}-${state}.png`) });
    async function duringRead(action, inspect) {
        let release;
        const pending = new Promise((done) => {
            release = done;
        });
        await page.route(
            `**/dapter/data/${source}`,
            async (route) => {
                await pending;
                await route.continue();
            },
            { times: 1 },
        );
        const response = page.waitForResponse(sourceResponse(source));
        try {
            await action.click();
            await inspect();
        } finally {
            release();
        }
        assert.equal((await response).status(), 200);
    }
    await duringRead(open, async () => {
        const cell = inventory.getByRole('cell').filter({ hasText: 'Loading results' });
        await cell.locator('wa-spinner').waitFor();
        assert.equal(await cell.getAttribute('colspan'), '3');
        await screenshot('loading');
    });
    await inventory.getByRole('cell', { name: 'Notebook 10', exact: true }).waitFor();
    await choose(demo, 'Table feedback', 'Replace the table');
    await demo.getByRole('checkbox', { name: 'Use skeleton rows' }).press('Space');
    const skeletonRows = inventory.locator('tbody tr').filter({ has: page.locator('wa-skeleton') });
    await duringRead(demo.getByRole('button', { name: 'Search for envelopes' }), async () => {
        await skeletonRows.nth(3).waitFor();
        assert.equal(await skeletonRows.count(), 4);
        assert.equal(await skeletonRows.first().locator('td').count(), 3);
        const cellPadding = await skeletonRows
            .first()
            .locator('td')
            .evaluateAll((cells) => cells.map((cell) => getComputedStyle(cell).paddingInlineStart));
        assert.equal(new Set(cellPadding).size, 1, 'Skeleton cells use the table row padding');
        const bar = await skeletonRows
            .first()
            .locator('wa-skeleton [part="indicator"]')
            .first()
            .boundingBox();
        assert(bar && bar.width > 0 && bar.height > 0);
        await screenshot('skeleton');
    });
    await inventory.getByText('No matching records', { exact: true }).waitFor();
    assert.equal(await inventory.locator('table').count(), 0);
    await inventory
        .getByText('Try a different search or adjust your filters.', { exact: true })
        .waitFor();
    await inventory.locator('wa-icon[name="magnifying-glass"] svg path').waitFor();
    await screenshot('no-matches');
    await duringRead(demo.getByRole('button', { name: 'Clear search' }), async () => {
        await skeletonRows.first().waitFor();
        assert.equal(await skeletonRows.count(), 2);
    });
    await read(page, demo, 'Open empty catalog', 'FrontAwesome.EmptyNotebooks');
    await inventory.getByText('No records yet', { exact: true }).waitFor();
    await choose(demo, 'Table feedback', 'Keep column headings');
    const empty = inventory.getByRole('cell').filter({ hasText: 'No records yet' });
    await empty.waitFor();
    assert.equal(await empty.getAttribute('colspan'), '3');
    await empty.locator('wa-icon[name="table-columns"] svg path').waitFor();
    await screenshot('empty');
}

async function verifyShortFinalPage(page, reads) {
    const table = page.getByTestId('data-view-first');
    const source = 'Dapter.Quickstart';
    await read(page, table, 'Start example', source);
    await read(page, table, 'Next page', source);
    await table.getByRole('cell', { name: 'Notebook 20', exact: true }).waitFor();
    const footer = table.locator('footer');
    const next = footer.getByRole('button', { name: 'Next page', exact: true });
    await next.focus();
    await footer.evaluate((element) =>
        element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
    const before = await footer.boundingBox();
    assert(before);
    const viewport = page.viewportSize().height;
    assert(before.y > 0 && before.y + before.height < viewport);
    assert(
        await page.evaluate(
            () => document.documentElement.scrollHeight - scrollY > 2 * innerHeight,
        ),
        'The fixture must have another screen of content below the pager',
    );
    const beforeReads = reads.length;
    const [response] = await Promise.all([
        page.waitForResponse(sourceResponse(source)),
        page.viewportSize().width === 390 ? next.tap() : next.press('Enter'),
    ]);
    assert.equal(response.status(), 200);
    await table.getByRole('cell', { name: 'Notebook 23', exact: true }).waitFor();
    await footer.getByText('21–23 of 23 records', { exact: true }).waitFor();
    await page.evaluate(
        () => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))),
    );
    const after = await footer.boundingBox();
    assert(
        after && Math.abs(after.y - before.y) <= 4,
        `Short final page moved the footer from ${before.y} to ${after?.y} CSS pixels`,
    );
    assert.equal(await table.locator('tbody tr').count(), 3);
    assert.equal(
        reads.length,
        beforeReads + 1,
        'Moving to the short final page must issue exactly one read',
    );
    assert(
        await footer.evaluate((element) => element.matches(':focus-within')),
        'Keyboard focus left the pager after the final page loaded',
    );
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() => {
        let control = document.activeElement;
        while (control?.shadowRoot?.activeElement) control = control.shadowRoot.activeElement;
        return control && control !== document.body && !control.matches(':disabled');
    });
    assert(active, 'Tab must reach an enabled control after loading the final page');
}

async function verifyPressSchedule(page, reads, width, theme) {
    const schedule = page.getByTestId('press-schedule');
    const source = 'FrontAwesome.PressSchedule';
    const before = reads.length;
    await read(page, schedule, 'Open the press schedule', source);
    const gesture = width === 390 ? 'tap' : 'click';
    for (const [action, state, jobs] of [
        [
            'Earliest deadline first',
            'Earliest deadline. Job ID breaks ties.',
            [201, 202, 204, 203, 205],
        ],
        [
            'Add largest run first',
            'Earliest deadline, then most sheets. Job ID breaks ties.',
            [202, 201, 204, 203, 205],
        ],
        [
            'Smallest run first',
            'Earliest deadline, then fewest sheets. Job ID breaks ties.',
            [201, 204, 202, 205, 203],
        ],
        ['Remove run size', 'Earliest deadline. Job ID breaks ties.', [201, 202, 204, 203, 205]],
    ]) {
        const accepted = await read(page, schedule, action, source, gesture);
        assert.deepEqual(
            accepted.body.data.map((row) => row.id),
            jobs,
        );
        await schedule.locator('[data-schedule-order]').filter({ hasText: state }).waitFor();
        const visible = await schedule
            .locator('[data-job]')
            .evaluateAll((rows) => rows.map((row) => Number(row.dataset.job)));
        assert.deepEqual(visible, jobs);
        if (await schedule.locator('.data-view-header').count()) {
            const icons = await schedule
                .locator('thead .sort-priority wa-icon')
                .evaluateAll((elements) => elements.map((icon) => icon.getAttribute('name')));
            assert.deepEqual(
                icons,
                action === 'Add largest run first' || action === 'Smallest run first'
                    ? ['square-1', 'square-2']
                    : [],
            );
        }
        if (action === 'Add largest run first') {
            if (width === 390) {
                const fits = await schedule.locator('table').evaluate((table) => {
                    const frame = table.parentElement;
                    return frame.scrollWidth <= frame.clientWidth + 1;
                });
                assert(fits, 'All three print schedule columns must fit in the mobile guide');
            }
            await captureDemo(page, schedule, width, `${width}-${theme}-multi-sort.png`);
        }
    }
    assert.equal(
        reads.length,
        before + 5,
        'Each touch or button action must issue exactly one read',
    );
    if (width === 390) return;
    const modifier = await page.evaluate(() =>
        /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Meta' : 'Control',
    );
    const [sorted] = await Promise.all([
        page.waitForResponse(sourceResponse(source)),
        schedule
            .getByRole('button', { name: 'Sheets', exact: true })
            .click({ modifiers: [modifier] }),
    ]);
    const result = await sorted.json();
    assert.deepEqual(
        result.requested.order.terms.map((term) => [term.field, term.direction]),
        [
            ['due', 'asc'],
            ['sheets', 'asc'],
        ],
    );
    assert.deepEqual(
        result.data.map((row) => row.id),
        [201, 204, 202, 205, 203],
    );
    assert.equal(reads.length, before + 6);
}

async function verifyPressroom(page, reads, width, theme) {
    const queue = page.getByTestId('pressroom-queue');
    const source = 'FrontAwesome.Pressroom';
    const initial = await read(page, queue, 'Open the support queue', source);
    assert.equal(initial.body.paging.total, 12);
    const before = reads.length;
    const trigger = optionsButton(queue);
    const unified = (await trigger.count()) > 0;
    if (process.env.DATA_VIEW_EXPECT_REDESIGN === '1')
        assert(unified, 'The queue must expose View options');
    const legacyFilters = queue.getByRole('button', { name: 'Search and filters', exact: true });
    if (unified) {
        assert.equal(await trigger.count(), 1);
        assert.equal(await trigger.getAttribute('aria-haspopup'), 'dialog');
        for (const label of ['Filters', 'Sort', 'Page settings']) {
            assert.equal(await queue.getByRole('button', { name: label, exact: true }).count(), 0);
        }
        const search = await queue
            .getByRole('textbox', { name: 'Search results', exact: true })
            .boundingBox();
        const button = await trigger.boundingBox();
        assert(
            search &&
                button &&
                button.x >= search.x + search.width - 1 &&
                button.y < search.y + search.height &&
                search.y < button.y + button.height,
            'The filter trigger must sit beside the quick search',
        );
        await queue
            .getByRole('group', { name: 'Results layout' })
            .getByRole('button', { name: 'Table', exact: true })
            .waitFor();
        await trigger.click();
        await queue.getByRole('dialog', { name: 'View options', exact: true }).waitFor();
        await queue.getByRole('group', { name: 'Status', exact: true }).waitFor();
        assert.equal(
            await queue.getByRole('button', { name: 'Results layout', exact: true }).count(),
            0,
        );
        await openOptions(queue, 'Page settings');
        assert.equal(await queue.getByRole('group', { name: 'Status', exact: true }).count(), 0);
        await queue.getByRole('spinbutton', { name: 'Go to page' }).waitFor();
        await openOptions(queue, 'Search');
        await choose(queue, 'Search scope', 'Search Ticket title');
        await queue.getByRole('group', { name: 'Search Ticket title' }).waitFor();
        await openOptions(queue, 'Sort');
        await queue.getByRole('combobox', { name: 'Order field', exact: true }).waitFor();
        await openOptions(queue, 'Filters');
    } else await legacyFilters.click();
    const status = queue.getByRole('group', { name: 'Status', exact: true });
    await status.getByRole('combobox', { name: 'Status', exact: true }).waitFor();
    await choose(status, 'Status', 'Waiting');
    assert.equal(reads.length, before, 'Editing a status sent a request');
    const filtered = await read(page, status, 'Apply', source);
    assert.equal(filtered.body.paging.filtered, 4);
    assert.equal(reads.length, before + 1);
    if (unified) {
        const dialog = queue.getByRole('dialog', { name: 'View options', exact: true });
        const bounds = await dialog.boundingBox();
        const viewport = page.viewportSize();
        assert(
            bounds &&
                bounds.x >= 0 &&
                bounds.y >= 0 &&
                bounds.x + bounds.width <= viewport.width + 1 &&
                bounds.y + bounds.height <= viewport.height + 1,
            'View options must fit the viewport',
        );
        await dialog.screenshot({ path: resolve(artifacts, `${width}-${theme}-view-options.png`) });
        await queue.getByRole('button', { name: 'Done', exact: true }).click();
        await waitForTrigger(page, trigger);
        await queue.getByRole('button', { name: 'Remove Status: Waiting', exact: true }).waitFor();
    } else await legacyFilters.click();
    await chooseLayout(queue, 'Table');
    const ordered = await read(page, queue, 'Reply due', source);
    const ids = [416, 418, 408, 406];
    assert.deepEqual(
        ordered.body.data.map((row) => row.id),
        ids,
    );
    async function displayedTickets() {
        return queue
            .locator('[data-ticket]')
            .evaluateAll((items) => items.map((item) => Number(item.dataset.ticket)));
    }
    const sortedReads = reads.length;
    const firstTicket = queue
        .getByRole('list', { name: 'Support tickets', exact: true })
        .getByRole('listitem')
        .first();
    for (const layout of ['List', 'Grid', 'Table']) {
        await chooseLayout(queue, layout);
        assert.deepEqual(await displayedTickets(), ids);
        if (layout === 'List') await firstTicket.getByText(/The copper foil/).waitFor();
        if (layout === 'Grid') await firstTicket.getByText('Ravi Shah').waitFor();
    }
    assert.equal(reads.length, sortedReads);
    if (width === 390) await chooseLayout(queue, 'List');
    await captureDemo(page, queue, width, `${width}-${theme}-pressroom.png`);
    if (unified) {
        const cleared = await read(page, queue, 'Remove Status: Waiting', source);
        assert.equal(cleared.body.paging.filtered, 12);
        assert.equal(cleared.body.requested.order.terms[0].field, 'due');
        const remainingSort = queue
            .getByRole('group', { name: 'Applied criteria' })
            .getByRole('button', { name: /Remove .*Reply due/ });
        await waitForTrigger(page, remainingSort);
        assert.equal(reads.length, sortedReads + 1);
        const search = await queue
            .getByRole('textbox', { name: 'Search results', exact: true })
            .boundingBox();
        const badge = await remainingSort.boundingBox();
        assert(
            search && badge && badge.y >= search.y + search.height,
            'Applied badges must sit below quick search',
        );
        await openOptions(queue, 'Page settings');
        const resized = page.waitForResponse(sourceResponse(source));
        await choose(queue, 'Rows per page', '10');
        assert.equal((await (await resized).json()).paging.per_page, 10);
        await queue.getByRole('button', { name: 'Done', exact: true }).click();
        const restored = await read(page, queue, 'Remove Rows per page: 10', source);
        assert.equal(restored.body.paging.per_page, 5);
    }
}

async function verifyPressroomSidebar(page, reads, width, theme) {
    const demo = page.getByTestId('pressroom-sidebar');
    await demo.getByRole('heading', { name: 'Ticket requests', exact: true }).waitFor();
    if (
        await demo
            .getByText(/The standalone controls require Front Awesome beta.9 or later/)
            .count()
    ) {
        assert.notEqual(
            process.env.DATA_VIEW_EXPECT_REDESIGN,
            '1',
            'The requested standalone controls are unavailable',
        );
        await demo
            .getByText(/The standalone controls require Front Awesome beta.9 or later/)
            .waitFor();
        return;
    }
    const source = 'FrontAwesome.Pressroom';
    const before = reads.length;
    await read(page, demo, 'Open the ticket list', source);
    const main = demo.locator('[data-queue="pressroom-main"]');
    await main.getByRole('navigation').waitFor();
    assert.equal(await main.getByRole('navigation').count(), 1);
    assert.equal(reads.length, before + 1);
    const status = main.getByRole('group', { name: 'Status', exact: true });
    await status.getByRole('combobox', { name: 'Status', exact: true }).waitFor();
    await choose(status, 'Status', 'Waiting');
    await read(page, status, 'Apply', source);
    const afterFilter = reads.length;
    const compare = main.getByRole('button', { name: 'Compare deadlines', exact: true });
    await compare.click();
    const dialog = main.getByRole('dialog', { name: 'Reply deadlines', exact: true });
    await dialog.waitFor();
    const host = main.locator('wa-dialog[label="Reply deadlines"]');
    const deadlines = host.getByRole('table', { name: 'Ticket deadlines', exact: true });
    await deadlines.getByRole('cell', { name: '09:45', exact: true }).waitFor();
    assert.equal(await deadlines.locator('tbody tr').count(), 4);
    assert.equal(await host.getByRole('navigation').count(), 0);
    assert.equal(await host.getByRole('textbox').count(), 0);
    const bounds = await dialog.boundingBox();
    assert(bounds && bounds.width <= 384, 'The comparison table must fit its narrow dialog');
    await dialog.screenshot({ path: resolve(artifacts, `${width}-${theme}-pressroom-dialog.png`) });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(
        () => document.activeElement?.textContent.trim() === 'Compare deadlines',
    );
    assert.equal(reads.length, afterFilter, 'Borrowing the page for a comparison sent a request');
    const searched = page.waitForResponse(sourceResponse(source));
    await main.getByRole('textbox', { name: 'Search tickets', exact: true }).fill('foil');
    assert.equal((await searched).status(), 200);
    await main.locator('[data-ticket="416"]').waitFor();
    await main.locator('[data-ticket]').nth(1).waitFor({ state: 'detached' });
    assert.equal(await main.locator('[data-ticket]').count(), 1);
    await captureDemo(page, demo, width, `${width}-${theme}-pressroom-sidebar.png`);
    const other = await read(page, demo, 'Open an independent queue', source);
    assert.equal(other.body.paging.filtered, 12);
    const comparison = demo.locator('[data-queue="pressroom-independent"]');
    await comparison.locator('[data-ticket]').nth(4).waitFor();
    assert.equal(await comparison.locator('[data-ticket]').count(), 5);
    await read(page, comparison, 'Next page', source);
    assert.equal(await main.getByRole('textbox', { name: 'Search tickets' }).inputValue(), 'foil');
    assert.equal(await main.locator('[data-ticket]').count(), 1);
    assert.equal(reads.length, before + 5);
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
                    const guideHeader = page.locator('article > header');
                    assert.equal(await guideHeader.locator('h1 wa-icon').count(), 0);
                    const sidebarIcon = page.locator(
                        '#docs-navigation a[aria-current="page"] wa-icon',
                    );
                    await sidebarIcon.locator('svg').waitFor({ state: 'attached' });
                    assert.equal(await sidebarIcon.getAttribute('aria-hidden'), 'true');
                    if (path) {
                        assert.equal(
                            await guideHeader
                                .getByRole('link', { name: 'DataView', exact: true })
                                .getAttribute('href'),
                            '/docs/front-awesome/data-view',
                        );
                    }
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
                    const numbered = (await translated.locator('wa-pagination').count()) > 0;
                    await translated
                        .getByRole('button', {
                            name: numbered ? 'Próxima página' : 'Próxima',
                            exact: true,
                        })
                        .waitFor();
                    await translated
                        .getByText(numbered ? '1–10 de 23 registros' : 'Página 1 de 3', {
                            exact: true,
                        })
                        .waitFor();
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
                const numbered = (await first.locator('wa-pagination').count()) > 0;
                const offsetNext = numbered ? 'Next page' : 'Next';
                const nextFirst = await read(
                    page,
                    first,
                    offsetNext,
                    'Dapter.Quickstart',
                    width === 390 ? 'tap' : 'click',
                );
                assert.equal(nextFirst.body.data[0].name, 'Notebook 11');
                await first.getByRole('cell', { name: 'Notebook 11', exact: true }).waitFor();
                const lastFirst = await read(page, first, offsetNext, 'Dapter.Quickstart');
                assert.equal(lastFirst.body.data.length, 3);
                assert.equal(lastFirst.body.data[0].name, 'Notebook 21');
                if (numbered) {
                    assert.equal(
                        await first.getByRole('group', { name: 'Applied criteria' }).count(),
                        0,
                        'Paging alone must not add a badge',
                    );
                    const beforeSettings = reads.length;
                    const settings = optionsButton(first);
                    await openOptions(first, 'Page settings');
                    assert.equal(
                        await first.getByRole('spinbutton', { name: 'Go to page' }).inputValue(),
                        '3',
                    );
                    await page.keyboard.press('Escape');
                    await waitForTrigger(page, settings);
                    assert.equal(
                        reads.length,
                        beforeSettings,
                        'Opening and dismissing page settings sent a read',
                    );
                }
                if (expectedApi === 'candidate') await verifyPressroom(page, reads, width, theme);
                await openGuide('layouts');
                await verifyTableFeedback(page, width, theme);
                if (expectedApi === 'candidate')
                    await verifyPressroomSidebar(page, reads, width, theme);
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
                await main.getByRole('button', { name: offsetNext, exact: true }).click();
                await main.getByRole('status').filter({ hasText: 'Updating results…' }).waitFor();
                await chooseLayout(main, 'Grid');
                await main.locator('li strong').filter({ hasText: 'Notebook 01' }).waitFor();
                release();
                assert.equal((await pending).status(), 200);
                await main.locator('li strong').filter({ hasText: 'Notebook 06' }).waitFor();
                await chooseLayout(main, 'List');
                await main.locator('li strong').filter({ hasText: 'Notebook 06' }).waitFor();
                await chooseLayout(main, 'Table');
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
                const redesigned = (await optionsButton(query).count()) > 0;
                const selectCriterion = async (label) => {
                    if (!redesigned) return;
                    const search = label.startsWith('Search ');
                    await openOptions(query, search ? 'Search' : 'Filters');
                    const chooser = query.getByRole('combobox', {
                        name: search ? 'Search scope' : 'Criterion',
                        exact: true,
                    });
                    if (await chooser.count())
                        await choose(query, search ? 'Search scope' : 'Criterion', label);
                };
                const selectOrder = async (frame, label) => {
                    const chooser = frame.getByRole('combobox', {
                        name: 'Order field',
                        exact: true,
                    });
                    if (redesigned && (await chooser.count()))
                        await choose(frame, 'Order field', label);
                };
                const disclosure = query.getByRole('button', {
                    name: redesigned ? 'View options' : 'Search and filters',
                    exact: true,
                    includeHidden: true,
                });
                await disclosure.focus();
                await disclosure.press('Enter');
                assert.equal(await disclosure.getAttribute('aria-expanded'), 'true');
                await selectCriterion('mark');
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
                    if (redesigned) {
                        await query.getByRole('button', { name: 'Done' }).click();
                        await waitForTrigger(page, disclosure);
                    }
                    await query
                        .getByRole('cell', { name: result.body.data[0].name, exact: true })
                        .waitFor();
                    if (redesigned) {
                        await query
                            .getByRole('button', { name: `Remove mark: ${label}`, exact: true })
                            .waitFor();
                        await disclosure.click();
                    }
                }
                await read(page, markGroup, 'Clear', 'FrontAwesome.Notebooks');
                await selectCriterion('Search name');
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
                if (redesigned) {
                    await query.getByRole('button', { name: 'Done' }).click();
                    await waitForTrigger(page, disclosure);
                }
                const globalSearch = query.getByRole('textbox', {
                    name: 'Search results',
                    exact: true,
                });
                await globalSearch.click();
                const [all] = await Promise.all([waitStock(), globalSearch.fill('C')]);
                assert.equal(JSON.parse(all.request().postData()).state.searchMatch, 'all');
                assert.deepEqual((await all.json()).data, []);
                if (redesigned) await openOptions(query, 'Search');
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
                await selectCriterion('Search Sheet count');
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
                await selectCriterion('Allowed stock marks');
                const allowed = query.getByRole('group', {
                    name: 'Allowed stock marks',
                    exact: true,
                });
                const beforeEmpty = reads.length;
                await allowed.getByRole('button', { name: 'Apply', exact: true }).click();
                await allowed.getByText('Choose an option.', { exact: true }).waitFor();
                assert.equal(reads.length, beforeEmpty);
                await allowed.getByRole('button', { name: 'Apply', exact: true }).press('Escape');
                await waitForTrigger(page, disclosure);

                const literal = page.locator('[data-comparison="literal"]');
                await read(page, literal, 'Start example', 'Dapter.LiteralStrictFluent');
                if (redesigned) {
                    await openOptions(literal, 'Search');
                    await choose(literal, 'Search scope', 'Search name');
                } else await literal.getByRole('button', { name: 'Search and filters' }).click();
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
                await chooseLayout(group, 'List');
                assert(
                    await group.getByRole('checkbox', { name: 'Select Notebook 10' }).isChecked(),
                );
                assert.equal(reads.length, selectionReads);
                await read(page, group, offsetNext, 'FrontAwesome.Notebooks');
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
                await verifyPressSchedule(page, reads, width, theme);
                const capabilities = page.getByTestId('data-view-capabilities');
                await read(page, capabilities, 'Start capabilities', 'Dapter.ComposedCatalog');
                const notebookHeader = capabilities.getByRole('columnheader', {
                    name: /^Notebook/,
                });
                await notebookHeader.getByText('↕', { exact: true }).waitFor();
                assert.equal(
                    await capabilities
                        .getByRole('columnheader', { name: 'Status', exact: true })
                        .getByRole('button')
                        .count(),
                    0,
                );
                const quantityIcon = capabilities
                    .getByRole('columnheader', { name: 'Quantity', exact: true })
                    .locator('wa-icon');
                assert.equal(
                    await quantityIcon.evaluate((icon) => icon.name),
                    redesigned ? 'up-down' : 'sort',
                );
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
                await notebookHeader.getByText('↓', { exact: true }).waitFor();
                await headerOrder('Quantity', true);
                assert.deepEqual(await headerOrder('Notebook'), {
                    kind: 'fields',
                    terms: [{ field: 'name', direction: 'asc', sortType: 'native' }],
                });
                await notebookHeader.getByText('↑', { exact: true }).waitFor();
                await quantityIcon.waitFor();
                await quantityIcon.locator('svg').waitFor();
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
                if (redesigned) await openOptions(capabilities, 'Sort');
                const presetRead = page.waitForResponse(sourceResponse('Dapter.ComposedCatalog'));
                await choose(capabilities, 'Order preset', 'Newest first');
                assert.deepEqual(JSON.parse((await presetRead).request().postData()).state.order, {
                    kind: 'preset',
                    id: 'reverse',
                });
                if (!redesigned)
                    await capabilities
                        .getByRole('button', { name: 'Ordering', exact: true })
                        .click();
                await selectOrder(capabilities, 'name');
                const byName = capabilities.getByRole('group', { name: 'name', exact: true });
                await choose(byName, 'Sort type', 'Natural');
                const firstTerm = await read(
                    page,
                    byName,
                    'Replace order',
                    'Dapter.ComposedCatalog',
                );
                assert.equal(firstTerm.request.state.order.terms[0].sortType, 'natural');
                await selectOrder(capabilities, 'quantity');
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
                await selectOrder(capabilities, 'rank');
                const rank = capabilities.getByRole('group', { name: 'rank', exact: true });
                assert.equal(await rank.getByRole('button', { name: 'Add to order' }).count(), 0);
                await selectOrder(capabilities, 'quantity');
                await read(
                    page,
                    capabilities.getByRole('group', { name: /quantity.*Priority 2/ }),
                    'Remove term',
                    'Dapter.ComposedCatalog',
                );
                if (redesigned) await capabilities.getByRole('button', { name: 'Done' }).click();
                const locale = page.locator('[data-comparison="locale"]');
                await read(page, locale, 'Start example', 'Dapter.ComparisonsLocaleFluent');
                if (redesigned) await openOptions(locale, 'Sort');
                else await locale.getByRole('button', { name: 'Ordering', exact: true }).click();
                await selectOrder(locale, 'name');
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
                if (numbered) await verifyShortFinalPage(page, reads);
                for (const source of [
                    'Dapter.PagingSimple',
                    'Dapter.PagingCursor',
                    'Dapter.InfiniteSimple',
                ]) {
                    const scope = page.locator(`[data-paging-demo="${source}"]`);
                    const initial = await read(page, scope, 'Start traversal', source);
                    assert.equal(initial.body.paging.total, null);
                    if (numbered) {
                        await scope
                            .getByText(
                                source === 'Dapter.InfiniteSimple'
                                    ? '2 records in view'
                                    : '2 records on this page',
                                { exact: true },
                            )
                            .waitFor();
                    }
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
                    assert.equal(
                        await scope.getByRole('group', { name: 'Applied criteria' }).count(),
                        0,
                        'Traversing pages or cursor positions must not add a badge',
                    );
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

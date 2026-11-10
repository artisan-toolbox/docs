import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import catalog from '../resources/js/components/docs/front-awesome/catalog/components.json' with { type: 'json' };

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(
    base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname),
    'Use a local documentation application for browser verification.',
);
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.addInitScript(() => {
    window.docsInitialNavigation = false;
    document.addEventListener('inertia:navigate', (event) => {
        if (event.detail.type === 'initial') window.docsInitialNavigation = true;
    });
});
async function navigate(url) {
    await page.goto(url);
    await page.waitForFunction(() => window.docsInitialNavigation === true);
}
const artifacts = resolve(import.meta.dirname, '../storage/app/browser-verification');
await mkdir(artifacts, { recursive: true });
async function nativeTransition(host, event, action) {
    await Promise.all([
        host.evaluate(
            (element, name) =>
                new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        element.removeEventListener(name, done);
                        reject(new Error(`Native ${name} did not complete.`));
                    }, 5000);
                    function done(event) {
                        if (event.target !== element) return;
                        clearTimeout(timeout);
                        element.removeEventListener(name, done);
                        resolve();
                    }
                    element.addEventListener(name, done);
                }),
            event,
        ),
        action(),
    ]);
}

let checked = 0;
let exportsChecked = 0;
let supplementalChecked = 0;
let iconWorkflows = 0;
let formWorkflows = 0;
let namedStateWorkflows = 0;
let responsiveFormLayouts = 0;
let ratingPointerSelections = 0;
let popoverWorkflows = 0;
let tooltipWorkflows = 0;
let skeletonWorkflows = 0;
let pageWorkflows = 0;
try {
    for (const group of catalog.groups) {
        await navigate(
            new URL(`/docs/front-awesome/web-awesome/components/${group.id}`, base).href,
        );
        await page
            .getByRole('list', { name: 'Component wrapper status', exact: true })
            .waitFor({ state: 'visible' });
        for (const item of group.components) {
            const card = page.locator(`[data-component="${item.tag}"]`);
            assert.equal(await card.count(), 1, `${item.name} remains discoverable`);
            if (item.implementation.state !== 'implemented') continue;
            exportsChecked++;
            const owner = group.components.find(
                (entry) => entry.implementation.export === item.implementation.demoOwner,
            );
            assert.equal(
                await card.locator(`a[href="#${item.implementation.anchor}"]`).count(),
                1,
                `${item.name} links to its stable component section`,
            );
            assert.equal(
                await page.locator(`h2[id="${item.implementation.anchor}"]`).count(),
                1,
                `${item.name} retains its public anchor`,
            );
            if (owner !== item) {
                assert.equal(
                    await card.locator(`a[href="#${owner.implementation.anchor}"]`).count(),
                    1,
                    `${item.name} links to its owner example`,
                );
                assert.equal(
                    await page
                        .locator(
                            `section[aria-labelledby="${item.implementation.anchor}"] [data-demo-frame]`,
                        )
                        .count(),
                    0,
                    `${item.name} has no duplicate scenario`,
                );
            }
        }
        for (const item of group.components.filter(
            (item) =>
                item.implementation.state === 'implemented' &&
                item.implementation.demoOwner === item.implementation.export,
        )) {
            const frame = page.locator(`[data-catalog-demo="${item.implementation.export}"]`);
            await frame.waitFor({ state: 'visible' });
            assert.equal(await frame.count(), 1, `${item.name} has one shared frame`);
            const viewport = frame.locator('[data-demo-viewport]');
            const source = await frame.locator('pre code').textContent();
            assert(
                source.includes('@artisan-toolbox/front-awesome'),
                `${item.name} source uses public exports`,
            );
            await frame.getByRole('button', { name: 'Compact', exact: true }).click();
            assert.equal(
                await frame
                    .getByRole('button', { name: 'Compact', exact: true })
                    .getAttribute('aria-pressed'),
                'true',
            );
            const compact = await viewport.boundingBox();
            assert(
                compact.width > 0 && compact.width <= 321,
                `${item.name} supports the compact viewport`,
            );
            await frame.getByRole('button', { name: 'Full', exact: true }).click();
            assert.equal(
                await frame
                    .getByRole('button', { name: 'Full', exact: true })
                    .getAttribute('aria-pressed'),
                'true',
            );
            const full = await viewport.boundingBox();
            assert(full.width >= compact.width, `${item.name} restores the available width`);
            if (item.implementation.export === 'Pagination') {
                await frame.getByRole('button', { name: 'Go to page five', exact: true }).click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Current page: 5' })
                    .waitFor();
                assert.equal(
                    await frame.locator('wa-pagination').evaluate((element) => element.page),
                    5,
                );
                await frame
                    .locator('wa-pagination')
                    .getByRole('button', { name: '4', exact: true })
                    .click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Current page: 4' })
                    .waitFor();
                namedStateWorkflows++;
            }
            if (item.implementation.export === 'TabGroup') {
                await frame.getByRole('button', { name: 'Open Usage tab', exact: true }).click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Active tab: usage' })
                    .waitFor();
                await frame.locator('wa-tab-panel[name="usage"]').waitFor({ state: 'visible' });
                await frame.locator('wa-tab[panel="install"]').click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Active tab: install' })
                    .waitFor();
                await frame.locator('wa-tab-panel[name="install"]').waitFor({ state: 'visible' });
                namedStateWorkflows++;
            }
            if (item.implementation.export === 'Stepper') {
                await frame.getByRole('button', { name: 'Go to Verify step', exact: true }).click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Active step: verify' })
                    .waitFor();
                assert.equal(
                    await frame.locator('wa-stepper').evaluate((element) => element.active),
                    'verify',
                );
                await frame.getByRole('button', { name: 'Previous', exact: true }).click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Active step: configure' })
                    .waitFor();
                await frame.getByRole('button', { name: 'Next', exact: true }).click();
                await frame
                    .locator('[data-demo-viewport] output')
                    .filter({ hasText: 'Active step: verify' })
                    .waitFor();
                namedStateWorkflows++;
            }
            if (item.implementation.export === 'Popover') {
                const panel = frame.getByText('Read the native Popover options.', { exact: true });
                const popover = frame.locator('wa-popover');
                await nativeTransition(popover, 'wa-after-show', () =>
                    frame.getByRole('button', { name: 'Show details', exact: true }).click(),
                );
                await panel.waitFor({ state: 'visible' });
                await frame.screenshot({ path: resolve(artifacts, 'popover-open.png') });
                await nativeTransition(popover, 'wa-after-hide', () =>
                    frame.getByRole('button', { name: 'Hide details', exact: true }).click(),
                );
                await panel.waitFor({ state: 'hidden' });
                const trigger = frame.getByRole('button', {
                    name: 'Component details',
                    exact: true,
                });
                await nativeTransition(popover, 'wa-after-show', () => trigger.press('Enter'));
                await panel.waitFor({ state: 'visible' });
                const reference = frame.getByRole('link', {
                    name: 'Web Awesome Popover reference',
                    exact: true,
                });
                if (!(await reference.evaluate((element) => document.activeElement === element)))
                    await page.keyboard.press('Tab');
                assert(
                    await reference.evaluate((element) => document.activeElement === element),
                    'Popover keyboard navigation reaches its reference link.',
                );
                await nativeTransition(popover, 'wa-after-hide', () =>
                    page.keyboard.press('Escape'),
                );
                await panel.waitFor({ state: 'hidden' });
                assert(
                    await trigger.evaluate(
                        (element) => element.getRootNode().activeElement === element,
                    ),
                    'Escape returns focus to the Popover trigger.',
                );
                popoverWorkflows++;
            }
            if (item.implementation.export === 'Page') {
                const shell = frame.locator('wa-page');
                await frame.getByRole('button', { name: 'Compact', exact: true }).click();
                await shell.locator('wa-drawer').waitFor({ state: 'attached' });
                await page.waitForFunction(
                    () =>
                        document
                            .querySelector('section[aria-labelledby="page"] wa-page')
                            ?.getAttribute('view') === 'mobile',
                );
                const drawer = shell.locator('wa-drawer');
                await nativeTransition(drawer, 'wa-after-show', () =>
                    frame.getByRole('button', { name: 'Menu', exact: true }).click(),
                );
                await frame
                    .getByText('Navigation region', { exact: true })
                    .waitFor({ state: 'visible' });
                await nativeTransition(drawer, 'wa-after-hide', () =>
                    page.keyboard.press('Escape'),
                );
                const mainWidth = await shell
                    .locator('[part="main"]')
                    .evaluate((element) => element.getBoundingClientRect().width);
                const shellWidth = await shell.evaluate(
                    (element) => element.getBoundingClientRect().width,
                );
                assert(
                    Math.abs(mainWidth - shellWidth) < 2,
                    'The compact Page content does not reserve a hidden navigation column.',
                );
                await frame.getByRole('button', { name: 'Full', exact: true }).click();
                await page.waitForFunction(
                    () =>
                        document
                            .querySelector('section[aria-labelledby="page"] wa-page')
                            ?.getAttribute('view') === 'desktop',
                );
                await frame.screenshot({ path: resolve(artifacts, 'page-regions.png') });
                pageWorkflows++;
            }
            if (item.implementation.export === 'Skeleton') {
                const skeletons = frame.locator('wa-skeleton');
                const indicator = skeletons.first().locator('[part="indicator"]');
                const dimensions = await indicator.boundingBox();
                assert(
                    dimensions?.height >= 16 && dimensions.width >= 100,
                    'Skeleton reserves a visible painted loading area.',
                );
                await frame
                    .getByRole('button', { name: 'Animate placeholders', exact: true })
                    .click();
                await page.waitForFunction(() => {
                    const hosts = document.querySelectorAll(
                        '#skeleton + * wa-skeleton, section[aria-labelledby="skeleton"] wa-skeleton',
                    );
                    return [...hosts].some(
                        (element) =>
                            getComputedStyle(element.shadowRoot.querySelector('[part="indicator"]'))
                                .animationName === 'pulse',
                    );
                });
                assert.equal(await skeletons.nth(1).getAttribute('effect'), 'pulse');
                assert.equal(await skeletons.nth(2).getAttribute('effect'), 'sheen');
                const animations = await skeletons.evaluateAll((hosts) =>
                    hosts.map(
                        (element) =>
                            getComputedStyle(element.shadowRoot.querySelector('[part="indicator"]'))
                                .animationName,
                    ),
                );
                assert.deepEqual(animations, ['none', 'pulse', 'sheen']);
                await frame.screenshot({ path: resolve(artifacts, 'skeleton-effects.png') });
                await frame.getByRole('button', { name: 'Pause animations', exact: true }).click();
                assert.deepEqual(
                    await skeletons.evaluateAll((hosts) => hosts.map((element) => element.effect)),
                    ['none', 'none', 'none'],
                );
                skeletonWorkflows++;
            }
            if (item.implementation.export === 'Tooltip') {
                const tooltip = frame.locator('wa-tooltip');
                const content = tooltip.locator('[part="body"]');
                await frame
                    .locator('wa-button')
                    .first()
                    .evaluate((element) =>
                        element.scrollIntoView({ block: 'center', behavior: 'instant' }),
                    );
                await nativeTransition(tooltip, 'wa-after-show', () =>
                    frame.getByRole('button', { name: 'Show help', exact: true }).click(),
                );
                await content.waitFor({ state: 'visible' });
                await page.screenshot({ path: resolve(artifacts, 'tooltip-open.png') });
                await nativeTransition(tooltip, 'wa-after-hide', () =>
                    frame.getByRole('button', { name: 'Hide help', exact: true }).click(),
                );
                await content.waitFor({ state: 'hidden' });
                const target = frame.getByRole('button', { name: /Save help/ }).first();
                await nativeTransition(tooltip, 'wa-after-show', () => target.focus());
                await content.waitFor({ state: 'visible' });
                await nativeTransition(tooltip, 'wa-after-hide', () =>
                    page.keyboard.press('Escape'),
                );
                await content.waitFor({ state: 'hidden' });
                tooltipWorkflows++;
            }
            checked++;
        }
        const supplemental = page.locator('[data-demo-frame]:not([data-catalog-demo])');
        for (const frame of await supplemental.all()) {
            assert(
                (await frame.locator('pre code').count()) > 0,
                'Every supplemental scenario displays its source.',
            );
            await frame.getByRole('button', { name: 'Compact', exact: true }).click();
            const compact = await frame.locator('[data-demo-viewport]').boundingBox();
            assert(
                compact.width > 0 && compact.width <= 321,
                'Supplemental scenario supports compact view.',
            );
            await frame.getByRole('button', { name: 'Full', exact: true }).click();
            supplementalChecked++;
        }
    }
    const implemented = catalog.groups
        .flatMap((group) => group.components)
        .filter((item) => item.implementation.state === 'implemented');
    assert.equal(exportsChecked, implemented.length);
    assert.equal(
        checked,
        implemented.filter((item) => item.implementation.demoOwner === item.implementation.export)
            .length,
    );

    await navigate(
        new URL('/docs/front-awesome/web-awesome/components/media#handle-load-and-error', base)
            .href,
    );
    const eventsFrame = page
        .locator('[data-demo-frame]')
        .filter({ has: page.getByRole('heading', { name: 'Native icon events', exact: true }) });
    const iconStatus = eventsFrame.locator('[data-demo-viewport] output');
    await eventsFrame.getByRole('button', { name: 'Load local SVG', exact: true }).click();
    await iconStatus.filter({ hasText: 'Icon loaded.' }).waitFor({ state: 'visible' });
    assert.equal(
        await eventsFrame.locator('[data-demo-viewport] wa-icon svg').count(),
        1,
        'The local SVG is painted.',
    );
    await eventsFrame.getByRole('button', { name: 'Try a missing SVG', exact: true }).click();
    await iconStatus.filter({ hasText: 'Icon failed to load.' }).waitFor({ state: 'visible' });
    await eventsFrame.getByRole('button', { name: 'Load local SVG', exact: true }).click();
    await iconStatus.filter({ hasText: 'Icon loaded.' }).waitFor({ state: 'visible' });
    await eventsFrame.getByRole('button', { name: 'Reset icon events', exact: true }).click();
    assert.equal(await eventsFrame.locator('[data-demo-viewport] wa-icon').count(), 0);
    const transformsFrame = page
        .locator('[data-demo-frame]')
        .filter({ has: page.getByRole('heading', { name: 'Icon transformations', exact: true }) });
    assert.equal(await transformsFrame.locator('[data-demo-viewport] wa-icon').count(), 0);
    await transformsFrame
        .getByRole('button', { name: 'Show transformations', exact: true })
        .click();
    assert.equal(await transformsFrame.locator('[data-demo-viewport] wa-icon').count(), 7);
    await transformsFrame
        .getByRole('button', { name: 'Start icon animation', exact: true })
        .click();
    assert.equal(
        await transformsFrame
            .locator('[data-demo-viewport] wa-icon[name="spinner"]')
            .getAttribute('animation'),
        'spin',
    );
    await transformsFrame
        .getByRole('button', { name: 'Pause icon animation', exact: true })
        .click();
    assert.equal(
        await transformsFrame
            .locator('[data-demo-viewport] wa-icon[name="spinner"]')
            .getAttribute('animation'),
        null,
    );
    await transformsFrame
        .getByRole('button', { name: 'Reset transformations', exact: true })
        .click();
    assert.equal(await transformsFrame.locator('[data-demo-viewport] wa-icon').count(), 0);
    iconWorkflows += 2;

    await navigate(
        new URL('/docs/front-awesome/web-awesome/components/forms#file-input', base).href,
    );
    const fileFrame = page.locator('[data-catalog-demo="FileInput"]');
    await fileFrame.locator('wa-file-input input[type="file"]').setInputFiles({
        name: 'example.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Example'),
    });
    await fileFrame
        .locator('[data-demo-viewport] output')
        .filter({ hasText: 'example.txt' })
        .waitFor({ state: 'visible' });
    await fileFrame.getByRole('button', { name: 'Clear selection', exact: true }).click();
    assert.equal(
        (await fileFrame.locator('[data-demo-viewport] output').textContent()).trim(),
        'No files selected',
    );
    formWorkflows++;

    const frameByTitle = (title) =>
        page
            .locator('[data-demo-frame]')
            .filter({ has: page.getByRole('heading', { name: title, exact: true }) });
    const liveOutput = (frame) => frame.locator('[data-demo-viewport] output');
    async function ratingClick(host, index) {
        await host.evaluate(async (element) => {
            element.scrollIntoView({ block: 'center', behavior: 'instant' });
            await element.updateComplete;
            await new Promise(requestAnimationFrame);
        });
        const symbol = await host.locator('.symbol').nth(index).boundingBox();
        assert(symbol && symbol.width > 0, 'A bound rating has a visible click target.');
        await page.mouse.click(symbol.x + symbol.width / 2, symbol.y + symbol.height / 2);
    }
    const inputFrame = page.locator('[data-catalog-demo="Input"]');
    const nameInput = inputFrame.locator('wa-input input');
    await nameInput.fill('Katherine');
    await liveOutput(inputFrame).filter({ hasText: 'Katherine' }).waitFor();
    await inputFrame.getByRole('button', { name: 'Use Grace', exact: true }).click();
    assert.equal(await nameInput.inputValue(), 'Grace');
    await inputFrame.locator('wa-input').getByRole('button', { name: /clear/i }).click();
    assert.equal(await nameInput.inputValue(), '');
    assert.equal((await liveOutput(inputFrame).textContent()).trim(), '');
    await inputFrame.getByRole('button', { name: 'Reset name', exact: true }).click();
    assert.equal(await nameInput.inputValue(), 'Ada');
    formWorkflows++;

    const inertiaFrame = frameByTitle('Bind text, boolean, and numeric Inertia fields');
    const mixedGrid = inertiaFrame.locator('[data-demo-viewport] .grid');
    const gridCells = () =>
        mixedGrid.locator(':scope > div').evaluateAll((cells) =>
            cells.map((cell) => {
                const rect = cell.getBoundingClientRect();
                return { x: rect.x, y: rect.y, width: rect.width };
            }),
        );
    await inertiaFrame.getByRole('button', { name: 'Compact', exact: true }).click();
    const compactCells = await gridCells();
    assert(
        compactCells.every((cell) => Math.abs(cell.x - compactCells[0].x) < 1),
        'Compact Inertia fields use one column.',
    );
    const compactContent = await inertiaFrame
        .locator('[data-demo-viewport] > div')
        .first()
        .evaluate((element) => ({ visible: element.clientWidth, content: element.scrollWidth }));
    assert(
        compactContent.content <= compactContent.visible + 1,
        'Compact Inertia fields do not clip horizontally.',
    );
    await inertiaFrame.screenshot({ path: resolve(artifacts, 'inertia-compact.png') });
    await inertiaFrame.getByRole('button', { name: 'Full', exact: true }).click();
    const fullGrid = await mixedGrid.boundingBox();
    const fullCells = await gridCells();
    const gridBreakpoint = await page.evaluate(
        () => 24 * Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
    );
    if (fullGrid.width >= gridBreakpoint) {
        assert(
            Math.abs(fullCells[0].y - fullCells[1].y) < 1 && fullCells[1].x > fullCells[0].x + 1,
            'Wide Inertia preview uses two columns.',
        );
    } else {
        assert(
            fullCells.every((cell) => Math.abs(cell.x - fullCells[0].x) < 1),
            'A narrow full preview keeps one column.',
        );
    }
    responsiveFormLayouts++;
    const emailInput = inertiaFrame.locator('wa-input input');
    await emailInput.fill('reader@example.com');
    await liveOutput(inertiaFrame).filter({ hasText: 'Email: reader@example.com.' }).waitFor();
    await inertiaFrame.getByRole('button', { name: "Use Grace's email", exact: true }).click();
    assert.equal(await emailInput.inputValue(), 'grace@example.com');
    await inertiaFrame.locator('wa-checkbox [part~="control"]').click();
    await liveOutput(inertiaFrame).filter({ hasText: 'Subscribed: true.' }).waitFor();
    await ratingClick(inertiaFrame.locator('wa-rating'), 3);
    await liveOutput(inertiaFrame).filter({ hasText: 'Score: 4.' }).waitFor();
    await inertiaFrame.locator('wa-slider [role="slider"]').press('ArrowRight');
    await liveOutput(inertiaFrame).filter({ hasText: 'Volume: 30.' }).waitFor();
    await inertiaFrame.getByRole('button', { name: 'Simulate server errors', exact: true }).click();
    await inertiaFrame.getByText('Email is already taken.', { exact: true }).waitFor();
    await inertiaFrame.getByText('Choose at least three stars.', { exact: true }).waitFor();
    assert.equal(await inertiaFrame.locator('wa-input').getAttribute('aria-invalid'), 'true');
    await inertiaFrame.screenshot({ path: resolve(artifacts, 'inertia-errors.png') });
    await emailInput.fill('updated@example.com');
    await inertiaFrame.getByText('Email is already taken.', { exact: true }).waitFor();
    await inertiaFrame.getByRole('button', { name: 'Clear server errors', exact: true }).click();
    await inertiaFrame
        .getByText('Email is already taken.', { exact: true })
        .waitFor({ state: 'hidden' });
    assert.equal(await inertiaFrame.locator('wa-input').getAttribute('aria-invalid'), null);
    await inertiaFrame.getByRole('button', { name: 'Reset form values', exact: true }).click();
    assert.equal(await emailInput.inputValue(), 'ada@example.com');
    await liveOutput(inertiaFrame)
        .filter({ hasText: 'Subscribed: false. Score: 2. Volume: 25.' })
        .waitFor();
    formWorkflows++;

    const collectionFrame = frameByTitle('Bind selections, tags, and local files');
    await collectionFrame
        .getByRole('button', { name: 'Use Portugal and two topics', exact: true })
        .click();
    await liveOutput(collectionFrame)
        .filter({ hasText: 'Country: pt. Topics: vue, forms.' })
        .waitFor();
    assert.equal(
        await collectionFrame.locator('wa-select').evaluate((element) => element.value),
        'pt',
    );
    await collectionFrame.locator('wa-select').click();
    await collectionFrame.locator('wa-option[value="ca"]').click();
    await liveOutput(collectionFrame).filter({ hasText: 'Country: ca.' }).waitFor();
    const tagInput = collectionFrame.locator('wa-tag-input input');
    await tagInput.fill('laravel');
    await tagInput.press('Enter');
    await liveOutput(collectionFrame).filter({ hasText: 'Topics: vue, forms, laravel.' }).waitFor();
    await collectionFrame.locator('wa-file-input input[type="file"]').setInputFiles({
        name: 'attachment.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('Local attachment'),
    });
    await liveOutput(collectionFrame).filter({ hasText: 'Files: attachment.txt.' }).waitFor();
    await collectionFrame
        .getByRole('button', { name: 'Simulate collection errors', exact: true })
        .click();
    await collectionFrame.getByText('Choose at least one local file.', { exact: true }).waitFor();
    await collectionFrame
        .getByRole('button', { name: 'Clear collection errors', exact: true })
        .click();
    await collectionFrame
        .getByText('Choose at least one local file.', { exact: true })
        .waitFor({ state: 'hidden' });
    await collectionFrame
        .getByRole('button', { name: 'Reset collection values', exact: true })
        .click();
    await liveOutput(collectionFrame)
        .filter({ hasText: 'Country: br. Topics: docs. Files: none.' })
        .waitFor();
    formWorkflows++;

    const calendarFrame = frameByTitle('Share an Inertia date between input and calendar');
    await calendarFrame.getByRole('button', { name: 'Use February 20', exact: true }).click();
    await liveOutput(calendarFrame).filter({ hasText: 'Delivery date: 2026-02-20.' }).waitFor();
    assert.equal(
        await calendarFrame.locator('wa-date-input').evaluate((element) => element.value),
        '2026-02-20',
    );
    const calendar = calendarFrame.locator('wa-date-picker:visible');
    await calendar.locator('button[data-date="2026-02-21"]').click();
    await liveOutput(calendarFrame).filter({ hasText: 'Delivery date: 2026-02-21.' }).waitFor();
    assert.equal(
        await calendarFrame.locator('wa-date-input').evaluate((element) => element.value),
        '2026-02-21',
    );
    await calendar.locator('button[data-date="2026-02-21"]').press('ArrowRight');
    assert.equal(
        await calendar.evaluate((element) => element.value),
        '2026-02-21',
        'Moving calendar focus does not select another date.',
    );
    await liveOutput(calendarFrame).filter({ hasText: 'Delivery date: 2026-02-21.' }).waitFor();
    await calendarFrame.getByRole('button', { name: 'Simulate date error', exact: true }).click();
    await calendarFrame
        .getByText('Choose an available delivery date.', { exact: true })
        .first()
        .waitFor();
    await calendarFrame.getByRole('button', { name: 'Clear date error', exact: true }).click();
    await calendarFrame
        .getByText('Choose an available delivery date.', { exact: true })
        .first()
        .waitFor({ state: 'hidden' });
    await calendarFrame.getByRole('button', { name: 'Reset date', exact: true }).click();
    await liveOutput(calendarFrame).filter({ hasText: 'Delivery date: 2026-01-15.' }).waitFor();
    formWorkflows++;

    const manualFrame = frameByTitle('Validate local values without submitting');
    await manualFrame.getByRole('button', { name: 'Validate local values', exact: true }).click();
    await manualFrame.getByText('Enter a display name.', { exact: true }).waitFor();
    await manualFrame.locator('wa-input input').fill('Lin');
    await manualFrame
        .getByText('Enter a display name.', { exact: true })
        .waitFor({ state: 'hidden' });
    await manualFrame.locator('wa-checkbox [part~="control"]').click();
    await ratingClick(manualFrame.locator('wa-rating'), 3);
    await liveOutput(manualFrame)
        .filter({ hasText: 'Name: Lin. Enabled: true. Rating: 4.' })
        .waitFor();
    await manualFrame
        .getByText('Choose at least three stars.', { exact: true })
        .waitFor({ state: 'hidden' });
    await manualFrame.getByRole('button', { name: 'Reset local validation', exact: true }).click();
    await liveOutput(manualFrame)
        .filter({ hasText: 'Name: empty. Enabled: false. Rating: 0.' })
        .waitFor();
    formWorkflows++;

    const bridgeFrame = frameByTitle('Reuse the public bridge in a custom text field');
    await bridgeFrame
        .getByRole('textbox', { name: 'Custom model field', exact: true })
        .fill('Katherine');
    await bridgeFrame
        .getByRole('textbox', { name: 'Custom Inertia field', exact: true })
        .fill('Dorothy');
    await liveOutput(bridgeFrame).filter({ hasText: 'Model: Katherine. Form: Dorothy.' }).waitFor();
    await bridgeFrame
        .getByRole('button', { name: 'Update both custom fields', exact: true })
        .click();
    assert.equal(
        await bridgeFrame
            .getByRole('textbox', { name: 'Custom model field', exact: true })
            .inputValue(),
        'Lin',
    );
    assert.equal(
        await bridgeFrame
            .getByRole('textbox', { name: 'Custom Inertia field', exact: true })
            .inputValue(),
        'Margaret',
    );
    await bridgeFrame
        .getByRole('button', { name: 'Simulate custom field error', exact: true })
        .click();
    await bridgeFrame.getByText('This nickname is already taken.', { exact: true }).waitFor();
    assert.equal(
        await bridgeFrame
            .getByRole('textbox', { name: 'Custom Inertia field', exact: true })
            .getAttribute('aria-invalid'),
        'true',
    );
    await bridgeFrame
        .getByRole('button', { name: 'Clear custom field error', exact: true })
        .click();
    await bridgeFrame
        .getByText('This nickname is already taken.', { exact: true })
        .waitFor({ state: 'hidden' });
    formWorkflows++;

    await navigate(new URL('/docs/front-awesome/web-awesome/components/forms#rating', base).href);
    const ratingFrame = page.locator('[data-catalog-demo="Rating"]');
    const rating = ratingFrame.locator('wa-rating');
    await rating.locator('.symbol').first().waitFor({ state: 'visible' });
    async function clickStar(index) {
        await rating.evaluate((element) =>
            element.scrollIntoView({ block: 'center', behavior: 'instant' }),
        );
        const symbol = await rating.locator('.symbol').nth(index).boundingBox();
        assert(symbol && symbol.width > 0, 'The target star is visible.');
        await page.mouse.click(symbol.x + symbol.width / 2, symbol.y + symbol.height / 2);
        const expected = String(index + 1);
        await page.waitForFunction(
            ({ expected }) => {
                const element = document.querySelector('[data-catalog-demo="Rating"] wa-rating');
                const frame = element.closest('[data-demo-frame]');
                return (
                    element.getAttribute('aria-valuenow') === expected &&
                    frame.querySelector('output[aria-live]')?.textContent.trim() ===
                        `Current value: ${expected}`
                );
            },
            { expected },
        );
        ratingPointerSelections++;
    }

    for (const size of ['Compact', 'Wide', 'Full']) {
        await ratingFrame.getByRole('button', { name: size, exact: true }).click();
        for (let index = 0; index < 5; index++) {
            await clickStar(index);
        }
        const dimensions = await rating.evaluate((element) => ({
            host: element.getBoundingClientRect().width,
            symbols: element.shadowRoot.querySelector('.symbols').getBoundingClientRect().width,
        }));
        assert(
            Math.abs(dimensions.host - dimensions.symbols) < 1,
            `Rating hit target matches visible symbols at ${size}`,
        );
    }
    await ratingFrame.getByRole('button', { name: 'Compact', exact: true }).click();
    const handle = ratingFrame.getByRole('separator');
    await handle.press('ArrowRight');
    assert.equal(await handle.getAttribute('aria-valuenow'), '330');
    await handle.press('Home');
    assert.equal(await handle.getAttribute('aria-valuenow'), '280');
    await handle.press('End');
    const initial = Number(await handle.getAttribute('aria-valuenow'));
    const grip = await handle.boundingBox();
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2);
    await page.mouse.down();
    await page.mouse.move(grip.x + grip.width / 2 - 60, grip.y + grip.height / 2, { steps: 8 });
    await page.mouse.up();
    assert(
        Number(await handle.getAttribute('aria-valuenow')) < initial - 90,
        'Pointer drag resizes the centered viewport',
    );
    await ratingFrame.getByRole('button', { name: 'Compact', exact: true }).click();
    await clickStar(2);
    await ratingFrame.screenshot({ path: resolve(artifacts, 'rating-compact.png') });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    await ratingFrame.screenshot({ path: resolve(artifacts, 'rating-dark.png') });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('dark'));
    await page.setViewportSize({ width: 390, height: 844 });
    await clickStar(0);
    await clickStar(2);
    await page.waitForFunction(
        () =>
            document
                .querySelector('[data-catalog-demo="Rating"] wa-rating')
                .closest('[data-demo-frame]')
                .querySelector('output[aria-live]')
                ?.textContent.trim() === 'Current value: 3',
    );
    const mobile = await page.evaluate(() => ({
        width: innerWidth,
        content: document.documentElement.scrollWidth,
    }));
    assert(
        mobile.content <= mobile.width + 1,
        `Forms has no document overflow at 390px (${mobile.content}px content)`,
    );
    await ratingFrame.screenshot({ path: resolve(artifacts, 'rating-mobile.png') });
    const historicalInputAnchors = [
        'use-v-model',
        'bind-an-inertia-form',
        'display-server-errors',
        'keep-web-awesome-behavior',
        'binding-contract',
        'reuse-the-bridge',
    ];
    for (const prefix of ['/docs', '/packages']) {
        for (const anchor of historicalInputAnchors) {
            await navigate(new URL(`${prefix}/front-awesome/input#${anchor}`, base).href);
            assert.equal(
                new URL(page.url()).pathname,
                '/docs/front-awesome/web-awesome/components/forms',
            );
            assert.equal(new URL(page.url()).hash, `#${anchor}`);
            await page.locator(`[id="${anchor}"]`).waitFor({ state: 'visible' });
        }
    }
    const bindingSubsections = ['bind-collections', 'bind-dates', 'manual-validation'];
    for (const anchor of bindingSubsections) {
        await navigate(
            new URL(`/docs/front-awesome/web-awesome/components/forms#${anchor}`, base).href,
        );
        await page.locator(`h4[id="${anchor}"]`).waitFor({ state: 'visible' });
        await page.waitForFunction((id) => {
            const heading = document.getElementById(id);
            const header = document.querySelector('header');
            if (!heading || !header) return false;
            const top = heading.getBoundingClientRect().top;
            const bottom = header.getBoundingClientRect().bottom;
            return top >= bottom && top <= bottom + 64;
        }, anchor);
    }
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(
        JSON.stringify(
            {
                catalogFrames: checked,
                implementedExports: exportsChecked,
                supplementalFrames: supplementalChecked,
                iconWorkflows,
                formWorkflows,
                namedStateWorkflows,
                responsiveFormLayouts,
                ratingPointerSelections,
                popoverWorkflows,
                tooltipWorkflows,
                skeletonWorkflows,
                pageWorkflows,
                resizing: 'presets, keyboard, pointer, mobile',
                themes: 'light and dark',
                historicalInputFragments: historicalInputAnchors.length * 2,
                visibleBindingSubsections: bindingSubsections.length,
                screenshots: artifacts,
                errors,
            },
            null,
            2,
        ),
    );
} catch (error) {
    console.error(
        JSON.stringify({
            url: page.url(),
            pageErrors: errors,
            visibleOutputs: await page
                .locator('[data-demo-viewport] output:visible')
                .allTextContents(),
        }),
    );
    throw error;
} finally {
    await context.close();
    await browser.close();
}

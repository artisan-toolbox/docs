import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const artifacts = resolve(import.meta.dirname, '../storage/app/browser-verification/adoption');
await mkdir(artifacts, { recursive: true });
const results = [];

try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                locale: 'en-US',
                viewport: { width, height: 1000 },
                colorScheme: theme,
                permissions: ['clipboard-read', 'clipboard-write'],
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));
            try {
                async function checkFragment() {
                    await page.waitForFunction(() => customElements.get('wa-skeleton'));
                    try {
                        await page.waitForFunction(
                            () => {
                                const heading = document.getElementById('skeleton');
                                const header = document.querySelector('header');
                                if (!heading || !header) return false;
                                const top = heading.getBoundingClientRect().top;
                                const bottom = header.getBoundingClientRect().bottom;
                                return top >= bottom && top <= bottom + 64;
                            },
                            null,
                            { timeout: 5000 },
                        );
                    } catch (error) {
                        console.log(
                            'Initial fragment geometry',
                            await page.evaluate(() => ({
                                hash: location.hash,
                                scroll: scrollY,
                                heading: document
                                    .getElementById('skeleton')
                                    ?.getBoundingClientRect()
                                    .toJSON(),
                                header: document
                                    .querySelector('header')
                                    ?.getBoundingClientRect()
                                    .toJSON(),
                            })),
                        );
                        await page.screenshot({
                            path: resolve(artifacts, 'initial-fragment-failure.png'),
                        });
                        throw error;
                    }
                }
                await page.goto(new URL('/docs/front-awesome', base).href);
                await page
                    .getByRole('button', { name: 'Search documentation', exact: true })
                    .click();
                await page
                    .getByRole('searchbox', { name: 'Search query', exact: true })
                    .fill('Skeleton');
                await page.getByRole('dialog').locator('a[href$="/feedback#skeleton"]').click();
                await page.waitForURL('**/feedback#skeleton');
                await checkFragment();
                await page.screenshot({
                    path: resolve(artifacts, `fragment-visit-${width}-${theme}.png`),
                });
                await page.reload();
                await checkFragment();
                await page.screenshot({
                    path: resolve(artifacts, `fragment-load-${width}-${theme}.png`),
                });
                const anchor = await page.locator('#skeleton').boundingBox();
                const startScroll = await page.evaluate(() => scrollY);
                await page.mouse.move(anchor.x + 20, anchor.y + 10);
                await page.mouse.wheel(0, 180);
                await page.waitForFunction((start) => scrollY > start + 100, startScroll);
                const rememberedScroll = await page.evaluate(() => scrollY);
                await page.waitForFunction(
                    (expected) => history.state?.documentScrollPosition?.top === expected,
                    rememberedScroll,
                );
                await page
                    .locator('header')
                    .getByRole('link', { name: 'Artisan Toolbox home', exact: true })
                    .click();
                await page.waitForURL(base.href);
                await page.goBack();
                await page.waitForURL('**/feedback#skeleton');
                try {
                    await page.waitForFunction(
                        (expected) => Math.abs(scrollY - expected) < 2,
                        rememberedScroll,
                        { timeout: 5000 },
                    );
                } catch (error) {
                    console.log('History scroll geometry', {
                        expected: rememberedScroll,
                        actual: await page.evaluate(() => ({
                            scroll: scrollY,
                            saved: history.state?.documentScrollPosition,
                        })),
                    });
                    throw error;
                }
                await page.goto(new URL('/docs/front-awesome', base).href);
                await page.locator('wa-callout').waitFor();
                await page.waitForFunction(
                    (value) => document.documentElement.classList.contains(`wa-${value}`),
                    theme,
                );
                const shell = page.locator('wa-page.site-page');
                await shell.waitFor();
                const skip = shell.getByRole('link', { name: 'Skip to content', exact: true });
                await skip.waitFor({ state: 'attached' });
                await page.keyboard.press('Tab');
                assert(
                    await skip.evaluate(
                        (element) => element.getRootNode().activeElement === element,
                    ),
                    'The native Page skip link is the first keyboard destination.',
                );
                await skip.press('Enter');
                await page.waitForFunction(() => document.activeElement?.id === 'main-content');
                assert.equal(
                    await page.locator('main').count(),
                    1,
                    'The application keeps one main landmark.',
                );
                const controls = [
                    page.getByRole('button', { name: 'Search documentation', exact: true }),
                    page.locator('header wa-select').locator('[part="combobox"]'),
                ];
                if (width >= 1024)
                    controls.push(
                        page
                            .locator('header')
                            .getByRole('link', { name: 'Documentation', exact: true }),
                        page.locator('header').getByRole('link', { name: 'GitHub', exact: true }),
                    );
                else controls.push(page.getByRole('button', { name: 'Menu', exact: true }));
                const boxes = await Promise.all(controls.map((control) => control.boundingBox()));
                for (const box of boxes) {
                    assert(
                        Math.abs(box.height - 44) < 1,
                        'Header painted controls have the same 44px height.',
                    );
                    assert(
                        Math.abs(box.y - boxes[0].y) < 1,
                        'Header painted controls align vertically.',
                    );
                }
                await page.screenshot({ path: resolve(artifacts, `header-${width}-${theme}.png`) });
                const other = theme === 'light' ? 'dark' : 'light';
                const themeControl = () => page.getByRole('combobox', { name: 'Color theme' });
                async function selectTheme(value) {
                    await themeControl().click();
                    await page
                        .getByRole('option', {
                            name: value === 'light' ? 'Light' : 'Dark',
                            exact: true,
                        })
                        .click();
                    await page.waitForFunction(
                        (expected) => document.documentElement.classList.contains(`wa-${expected}`),
                        value,
                    );
                    assert(
                        !(await context.cookies()).some((cookie) => cookie.name === 'appearance'),
                        'Theme selection uses backend session preferences.',
                    );
                }
                await selectTheme(other);
                await page.reload();
                await page.waitForFunction(
                    (value) => document.documentElement.classList.contains(`wa-${value}`),
                    other,
                );
                await selectTheme(theme);
                const callout = page.locator('aside[aria-label="Caution"]');
                await callout.scrollIntoViewIfNeeded();
                assert(
                    (await callout.boundingBox()).width <= width,
                    'Callout fits the reading column.',
                );
                await callout.screenshot({
                    path: resolve(artifacts, `callout-${width}-${theme}.png`),
                });

                const code = page.locator('figure[data-code-language]').first();
                const expected = await code.locator('pre code').textContent();
                const copy = code.getByRole('button');
                await copy.click();
                await page.waitForFunction(() =>
                    [...document.querySelectorAll('figure [role="status"]')].some((node) =>
                        node.textContent.includes('Code copied to clipboard.'),
                    ),
                );
                assert.equal(
                    await page.evaluate(() => navigator.clipboard.readText()),
                    expected,
                    'Native CopyButton writes the exact source.',
                );
                await code.screenshot({ path: resolve(artifacts, `copy-${width}-${theme}.png`) });

                await page.evaluate(() => {
                    window.clipboardAttempts = [];
                    Object.defineProperty(navigator.clipboard, 'writeText', {
                        configurable: true,
                        value: async (text) => {
                            window.clipboardAttempts.push(text);
                            throw new DOMException('Test clipboard denial', 'NotAllowedError');
                        },
                    });
                });
                await page.waitForFunction(
                    () => document.querySelector('wa-copy-button')?.status === 'rest',
                );
                await copy.click();
                await page.waitForFunction(() =>
                    [...document.querySelectorAll('figure [role="status"]')].some((node) =>
                        node.textContent.includes('Unable to copy.'),
                    ),
                );
                assert.deepEqual(
                    await page.evaluate(() => window.clipboardAttempts),
                    [expected],
                    'Denied clipboard receives the same exact source.',
                );
                assert.equal(
                    await code.locator('pre code').textContent(),
                    expected,
                    'Source remains available after denial.',
                );
                await page.evaluate(() =>
                    Object.defineProperty(navigator, 'clipboard', {
                        configurable: true,
                        value: undefined,
                    }),
                );
                await page.waitForFunction(
                    () => document.querySelector('wa-copy-button')?.status === 'rest',
                );
                await copy.click();
                await page.waitForFunction(
                    () => document.querySelector('wa-copy-button')?.status === 'error',
                );
                assert(
                    (await code.getByRole('status').allTextContents())
                        .join(' ')
                        .includes('Unable to copy. Select the code and copy it manually.'),
                    'Unavailable clipboard keeps the manual fallback.',
                );

                const trigger = page.getByRole('button', {
                    name: 'Search documentation',
                    exact: true,
                });
                await trigger.click();
                const dialog = page.getByRole('dialog', { name: 'Search documentation' });
                const modal = dialog;
                await modal.waitFor();
                const query = page.getByRole('searchbox', { name: 'Search query' });
                await query.fill('FormData');
                await dialog.locator('ul[aria-label="Search results"] a').first().waitFor();
                assert(
                    (await dialog.locator('ul[aria-label="Search results"] a').count()) > 0,
                    'Actual indexed search returns ordinary links.',
                );
                await page.screenshot({ path: resolve(artifacts, `search-${width}-${theme}.png`) });
                await query.press('Escape');
                await modal.waitFor({ state: 'hidden' });
                await page.waitForFunction(
                    () =>
                        document.activeElement?.getAttribute('aria-label') ===
                        'Search documentation',
                );

                await trigger.press('Control+k');
                await modal.waitFor();
                assert.equal(await query.inputValue(), '', 'Reopening clears the previous search.');
                for (let index = 0; index < 6; index++) {
                    await page.keyboard.press('Tab');
                    assert(
                        await dialog.evaluate((element) =>
                            element.contains(document.activeElement),
                        ),
                        'Keyboard focus stays in the modal.',
                    );
                }
                await page.keyboard.press('Escape');
                await modal.waitFor({ state: 'hidden' });
                await trigger.click();
                await modal.waitFor();
                await page
                    .locator('div[data-state="open"].inset-0')
                    .click({ position: { x: 5, y: 5 } });
                await modal.waitFor({ state: 'hidden' });
                if (width < 1024) {
                    const menu = page.getByRole('button', { name: 'Menu', exact: true });
                    await menu.click();
                    const panel = page.locator('#docs-navigation');
                    const panelBox = await panel.boundingBox();
                    const headerBox = await page.locator('header').first().boundingBox();
                    assert(
                        Math.abs(panelBox.y - headerBox.y - headerBox.height) < 2,
                        'Mobile navigation clears the actual wrapping header.',
                    );
                    await page.screenshot({
                        path: resolve(artifacts, `menu-${width}-${theme}.png`),
                    });
                    await panel.getByRole('link', { name: 'Back to home' }).focus();
                    await page.keyboard.press('Escape');
                    await page.waitForFunction(
                        () =>
                            document.activeElement?.getAttribute('aria-controls') ===
                            'docs-navigation',
                    );
                }

                await page.goto(new URL('/docs/core/conditional-arrays', base).href);
                const core = page.locator('[data-demo-frame]').first();
                const contact = page.getByRole('checkbox', { name: 'Include the nested contact' });
                const extra = page.getByRole('checkbox', {
                    name: 'Include the middle item (QZ Tray)',
                });
                await core
                    .locator('wa-checkbox')
                    .filter({ hasText: 'Include the nested contact' })
                    .click();
                await core
                    .locator('wa-checkbox')
                    .filter({ hasText: 'Include the middle item (QZ Tray)' })
                    .click();
                assert(
                    (await contact.isChecked()) && (await extra.isChecked()),
                    'Visible checkbox labels toggle native checked state.',
                );
                let release;
                const gate = new Promise((resolve) => {
                    release = resolve;
                });
                const endpoint = new URL('/demo/core/conditional-arrays', base).href;
                await page.route(endpoint, async (route) => {
                    await gate;
                    await route.continue();
                });
                let response;
                try {
                    const [request] = await Promise.all([
                        page.waitForRequest(
                            (request) => request.url() === endpoint && request.method() === 'POST',
                        ),
                        core.getByRole('button', { name: 'Run example', exact: true }).click(),
                    ]);
                    assert.deepEqual(request.postDataJSON(), {
                        includeContact: true,
                        includeExtraItem: true,
                    });
                    assert(
                        (await contact.isDisabled()) && (await extra.isDisabled()),
                        'Both native checkboxes disable while the request is pending.',
                    );
                    response = page.waitForResponse(
                        (response) =>
                            response.url() === endpoint && response.request().method() === 'POST',
                    );
                } finally {
                    release();
                }
                const data = await (await response).json();
                assert.deepEqual(data.options, { includeContact: true, includeExtraItem: true });
                assert.equal(data.contactEvaluated, true);
                await core.getByText('Server result ready.', { exact: true }).waitFor();
                await core.screenshot({ path: resolve(artifacts, `core-${width}-${theme}.png`) });
                await core.getByRole('button', { name: 'Reset', exact: true }).click();
                assert(
                    !(await contact.isChecked()) && !(await extra.isChecked()),
                    'Reset restores native checkbox state.',
                );
                const source = core.locator('details');
                await source.locator('summary').click();
                assert(
                    (await source.locator('pre code').first().textContent()).includes(
                        'ConditionalArraysController',
                    ),
                    'Source remains authored code.',
                );
                const sourcePadding = await source
                    .locator('pre')
                    .first()
                    .evaluate((element) => parseFloat(getComputedStyle(element).paddingTop));
                assert(
                    sourcePadding >= 20 && sourcePadding <= 24,
                    'Source spacing keeps the application Tailwind scale.',
                );
                await page.screenshot({ path: resolve(artifacts, `source-${width}-${theme}.png`) });
                await page.goto(new URL('/docs/mosaicast/inertia-delivery', base).href);
                const message = page
                    .getByRole('textbox', { name: 'Message for both paths' })
                    .first();
                const messageForm = page.locator('form').filter({ has: message }).first();
                await messageForm.screenshot({
                    path: resolve(artifacts, `mosaicast-form-${width}-${theme}.png`),
                });
                if (width === 390) {
                    const formBox = await messageForm.boundingBox();
                    const fieldBox = await messageForm.locator('wa-input').boundingBox();
                    const messageBox = await message.boundingBox();
                    const runBox = await messageForm
                        .getByRole('button', { name: 'Run one event', exact: true })
                        .boundingBox();
                    const resetBox = await messageForm
                        .getByRole('button', { name: 'Reset', exact: true })
                        .boundingBox();
                    assert(
                        Math.abs(fieldBox.width - formBox.width) <= 1,
                        `The mobile message field fills its own row. ${JSON.stringify({ formBox, fieldBox })}`,
                    );
                    assert(
                        (await message.isVisible()) && messageBox.width >= formBox.width - 64,
                        'The mobile textbox remains visible and wide enough to edit the message.',
                    );
                    assert(
                        runBox.y >= fieldBox.y + fieldBox.height - 1 &&
                            resetBox.y >= fieldBox.y + fieldBox.height - 1,
                        'Both mobile actions wrap below the message field.',
                    );
                }
                await message.fill('Both paths keep this exact message.');
                assert.equal(await message.inputValue(), 'Both paths keep this exact message.');
                assert.equal(await message.getAttribute('maxlength'), '120');
                await page.screenshot({
                    path: resolve(artifacts, `mosaicast-${width}-${theme}.png`),
                });
                const overflow = await page.evaluate(
                    () => document.documentElement.scrollWidth - innerWidth,
                );
                assert(overflow <= 1, `No application overflow at ${width}px.`);
                assert.deepEqual(errors, [], 'No browser exceptions.');
                results.push({
                    width,
                    theme,
                    clipboard: 'exact success, denied, unavailable',
                    search: 'real results, Escape, focus trap, backdrop, reopen',
                    themePersistence: 'selection, cookie, reload',
                    page: 'initial and Inertia fragments, history scroll, native skip focus, one main landmark, header size and alignment',
                    core: 'real boolean request, pending, response, reset, source',
                    mosaicast: 'shared message input and mobile field/action layout',
                    errors,
                });
            } finally {
                await context.close();
            }
        }
    }
    console.log(JSON.stringify({ results, screenshots: artifacts }, null, 2));
} finally {
    await browser.close();
}

import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, expect } from 'playwright/test';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve(
    process.env.DAPTER_GUIDES_ARTIFACTS ?? 'storage/app/browser-verification/dapter-guides',
);
const home = '/docs/dapter';
const groupSlugs = [
    'installation',
    'sources',
    'listing',
    'vue-controls',
    'field-search',
    'field-filters',
    'field-order',
    'actions',
    'resources',
    'live-updates',
    'authority',
    'development',
];
const literalPath = [home, `${home}/field-search`, `${home}/literal-search`];
const configuration = `${home}/literal-search/configuration`;
const fields = [
    {
        task: 'search',
        slug: 'field-search',
        label: 'Search name',
        choice: 'Pencil',
        ids: [3, 4],
        clear: 'Clear search',
    },
    {
        task: 'filter',
        slug: 'field-filters',
        label: 'Category',
        choice: 'tools',
        ids: [3, 4],
        clear: 'Clear category',
    },
    {
        task: 'sort',
        slug: 'field-order',
        label: 'Name order',
        choice: 'Ascending',
        ids: [2, 1],
        clear: 'Clear order',
    },
];
const button = (scope, name) => scope.getByRole('button', { name, exact: true });
const notebooks = (first, last) =>
    Array.from(
        { length: last - first + 1 },
        (_, offset) => `Notebook ${String(first + offset).padStart(2, '0')}`,
    );
const isRead = (request) =>
    request.method() === 'POST' && new URL(request.url()).pathname.startsWith('/dapter/data/');

async function read(page, source, action) {
    const [response] = await Promise.all([
        page.waitForResponse(
            (response) =>
                isRead(response.request()) &&
                new URL(response.url()).pathname === `/dapter/data/${source}`,
        ),
        action(),
    ]);
    assert.equal(response.status(), 200, response.url());
    return response.request().postDataJSON();
}

async function openDemo(page, reads, slug, selector, theme, startLabel = 'Start example') {
    const before = reads.length;
    const response = await page.goto(new URL(slug, base).href);
    assert.equal(response.status(), 200, slug);
    const frame = page.locator(selector);
    await expect(button(frame, startLabel)).toBeVisible();
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\bwa-${theme}\\b`));
    const scripts = await page
        .locator('script[type="module"][src]')
        .evaluateAll((nodes) => nodes.map((node) => new URL(node.src).pathname));
    assert(
        scripts.some((path) => /^\/build\/assets\/app-[\w-]+\.js$/.test(path)),
        slug,
    );
    assert(
        !scripts.some((path) => path.includes('/@vite/') || path.startsWith('/resources/')),
        slug,
    );
    assert.equal(reads.length, before, `Opening ${slug} starts no Dapter reads`);
    return frame;
}

async function checkNavigation(page, width, capture) {
    const nav = page.getByRole('navigation', { name: 'Documentation', exact: true });
    const menu = button(page, 'Menu');
    if (width === 390) {
        await expect(menu).toHaveAttribute('aria-controls', 'docs-navigation');
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
        await expect(nav).toBeHidden();
        await menu.press('Enter');
        await expect(menu).toHaveAttribute('aria-expanded', 'true');
        await nav.getByRole('link', { name: 'Dapter', exact: true }).press('Escape');
        await expect(nav).toBeHidden();
        await expect(menu).toBeFocused();
        await menu.press('Enter');
    }
    await expect(nav).toBeVisible();
    const branch = nav
        .getByRole('link', { name: 'Dapter', exact: true })
        .locator('xpath=ancestor::li[1]');
    const groups = branch.locator(':scope > ul > li > div > a');
    assert.deepEqual(
        await groups.evaluateAll((nodes) => nodes.map((node) => node.pathname)),
        groupSlugs.map((slug) => `${home}/${slug}`),
    );
    const links = branch.locator('a');
    const paths = await links.evaluateAll((nodes) => nodes.map((node) => node.pathname));
    assert.equal(paths.length, 64);
    assert.equal(new Set(paths).size, paths.length);
    assert(paths.includes(`${home}/vector-search`));
    assert(paths.every((path) => path === home || path.startsWith(`${home}/`)));

    const guideLinks = branch.locator(`a[href^="${home}/"]`);
    const icons = guideLinks.locator('wa-icon');
    await expect(icons).toHaveCount(paths.length - 1);
    await expect
        .poll(
            () =>
                guideLinks.evaluateAll((nodes) =>
                    nodes
                        .filter((link) => {
                            const icon = link.querySelector('wa-icon');
                            const name = icon?.getAttribute('name');
                            return (
                                !name ||
                                name === 'file-lines' ||
                                !icon.shadowRoot?.querySelector('svg path[d]')
                            );
                        })
                        .map((link) => link.pathname),
                ),
            { timeout: 45000, message: 'Every guide has a rendered, task-specific icon' },
        )
        .toEqual([]);
    await capture('navigation');
    for (const path of literalPath.slice(1)) {
        const section = nav.locator(`a[href="${path}"]`).locator('..').getByRole('button');
        await expect(section).toHaveAttribute('aria-expanded', 'false');
        await section.click();
    }
    await nav.locator(`a[href="${configuration}"]`).click();
    await expect(page).toHaveURL(new URL(configuration, base).href);
    await page.reload();
    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
    const current = crumbs.locator('[aria-current="page"]');
    await expect(current).toHaveText('Configure literal search defaults');
    assert.deepEqual(
        await crumbs.getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.pathname)),
        ['/', '/docs', ...literalPath],
    );
    if (width === 390) {
        await expect(nav).toBeHidden();
        await menu.click();
    }
    await expect(nav.locator('a[aria-current="page"]')).toHaveAttribute('href', configuration);
    await expect(nav.locator('a[aria-current="page"]')).toBeVisible();
    for (const path of literalPath) {
        await expect(
            nav.locator(`a[href="${path}"]`).locator('..').getByRole('button'),
        ).toHaveAttribute('aria-expanded', 'true');
    }
    return paths;
}

async function checkField(page, frame, field, capture) {
    const url = page.url();
    const source = 'Dapter.VueCatalog';
    const rows = frame
        .getByRole('table', { name: 'Accepted catalog table' })
        .locator('tbody tr td:first-child');
    assert.deepEqual(await read(page, source, () => button(frame, 'Start example').click()), {
        version: 2,
    });
    await expect(rows).toHaveText(['1', '2']);
    const change = async (value) => {
        if (field.task === 'search') {
            await frame.getByRole('textbox', { name: field.label, exact: true }).fill(value);
        } else {
            await frame.getByRole('combobox', { name: field.label, exact: true }).click();
            await frame.getByRole('option', { name: value, exact: true }).click();
        }
    };
    await read(page, source, () => change(field.choice));
    await expect(rows).toHaveText(field.ids.map(String));
    await expect(page).toHaveURL(url);
    await capture(field.task, frame);
    if (field.task === 'search') {
        await read(page, source, () => change('Eraser'));
        await expect(frame.getByText('No matching records.', { exact: true })).toBeVisible();
        await expect(rows).toHaveCount(0);
        await expect(page).toHaveURL(url);
    }
    await read(page, source, () => button(frame, field.clear).click());
    await expect(rows).toHaveText(['1', '2']);
    await expect(page).toHaveURL(url);
}

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
            const page = await context.newPage();
            const reads = [];
            const errors = [];
            const devAssets = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (isRead(request)) reads.push(new URL(request.url()).pathname);
                if (new URL(request.url()).pathname.includes('/@vite/'))
                    devAssets.push(request.url());
            });
            const capture = async (name, frame = page) => {
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth),
                    width,
                    page.url(),
                );
                await frame.screenshot({
                    path: resolve(artifacts, `${name}-${width}-${theme}.png`),
                });
            };
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            try {
                const quickstart = await openDemo(
                    page,
                    reads,
                    home,
                    '[data-quickstart-usage]',
                    theme,
                );
                const guideUrls = await checkNavigation(page, width, capture);
                assert.deepEqual(reads, [], 'Browsing the guide hierarchy starts no Dapter reads');
                await openDemo(page, reads, home, '[data-quickstart-usage]', theme);
                const source = 'Dapter.Quickstart';
                const names = quickstart
                    .getByRole('list', { name: 'Notebooks', exact: true })
                    .getByRole('listitem');
                assert.deepEqual(
                    await read(page, source, () => button(quickstart, 'Start example').click()),
                    { version: 1 },
                );
                await expect(names).toHaveText(notebooks(1, 10));
                await read(page, source, () => button(quickstart, 'Next').click());
                await expect(names).toHaveText(notebooks(11, 20));
                await capture('quickstart', quickstart);

                for (const field of fields) {
                    const frame = await openDemo(
                        page,
                        reads,
                        `${home}/${field.slug}`,
                        `[data-field-usage="${field.task}"]`,
                        theme,
                    );
                    await checkField(page, frame, field, capture);
                }
                const more = await openDemo(
                    page,
                    reads,
                    `${home}/infinite-loading`,
                    '[data-manual-append]',
                    theme,
                );
                const url = page.url();
                const loaded = more
                    .getByRole('list', { name: 'Loaded notebooks', exact: true })
                    .getByRole('listitem');
                const append = button(more, 'Load more');
                assert.deepEqual(
                    await read(page, source, () => button(more, 'Start example').click()),
                    { version: 2 },
                );
                await expect(loaded).toHaveText(notebooks(1, 10));
                for (const last of [20, 23]) {
                    await read(page, source, () => append.click());
                    await expect(loaded).toHaveText(notebooks(1, last));
                    await expect(page).toHaveURL(url);
                }
                await expect(append).toBeDisabled();
                await capture('manual-append', more);
                const selectors = await openDemo(
                    page,
                    reads,
                    `${home}/action-outcomes`,
                    '[data-string-selector-demo]',
                    theme,
                    'Load string records',
                );
                await read(page, 'Dapter.StringActionCatalog', () =>
                    button(selectors, 'Load string records').click(),
                );
                const selected = [];
                for (const key of ['{draft}', 'part/', '..', '%2F', ' key ']) {
                    const [response] = await Promise.all([
                        page.waitForResponse(
                            (response) =>
                                response.request().method() === 'POST' &&
                                new URL(response.url()).pathname.startsWith('/dapter/actions/'),
                        ),
                        button(selectors, `Inspect ${JSON.stringify(key)}`).click(),
                    ]);
                    assert.equal(response.status(), 200);
                    if (key.trim() === key) {
                        assert.equal(response.request().postDataJSON().recordId, key);
                    } else {
                        assert.match(
                            response.request().headers()['content-type'],
                            /^multipart\/form-data;/,
                        );
                        assert(response.request().postData().includes('\r\n key \r\n'));
                        assert(response.request().postData().includes('filename="inspection.txt"'));
                    }
                    assert.equal((await response.json()).selected, key);
                    await expect(
                        selectors.locator('[data-string-selector-result]'),
                    ).toHaveJSProperty('textContent', key);
                    selected.push(key);
                }
                await capture('string-selectors', selectors);
                assert.equal(reads.length, 16, 'Each reader action issues one read');
                assert.deepEqual(errors, []);
                assert.deepEqual(devAssets, []);
                results.push({ width, theme, guideUrls, reads, selected, errors });
            } catch (error) {
                await page.screenshot({
                    path: resolve(artifacts, `failure-${width}-${theme}.png`),
                });
                await writeFile(
                    resolve(artifacts, `failure-${width}-${theme}.json`),
                    JSON.stringify(
                        {
                            url: page.url(),
                            error: String(error),
                            reads,
                            errors,
                            devAssets,
                            body: await page.locator('body').innerText(),
                        },
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
        'Verified Dapter guide navigation, paging, search, filtering, sorting, and manual appends in four browser sessions.',
    );
} finally {
    await browser.close();
}

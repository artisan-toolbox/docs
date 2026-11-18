import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test'));
const artifacts = resolve('storage/app/browser-verification/dapter-actions');
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const results = [];
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
            const page = await context.newPage(),
                errors = [],
                writes = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (request.url().includes('/dapter/actions/')) writes.push(request);
            });
            try {
                for (const protocol of [1, 2]) {
                    await page.goto(new URL('/docs/dapter/actions', base).href);
                    const frame = page.locator(`[data-action-demo="${protocol}"]`);
                    await frame
                        .getByText('Ready. Start action demo to read its authorized controls.', {
                            exact: true,
                        })
                        .waitFor();
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((items) => items.map((item) => item.src));
                    assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                    await frame
                        .getByRole('button', { name: 'Start action demo', exact: true })
                        .click();
                    await frame.getByText('Borrowed view counter 0.', { exact: true }).waitFor();
                    const dispatch = async (label, status) => {
                        const next = page.waitForResponse((response) =>
                            response.url().includes('/dapter/actions/'),
                        );
                        await frame.getByRole('button', { name: label, exact: true }).click();
                        const response = await next;
                        assert.equal(response.status(), status);
                        return response;
                    };
                    await dispatch('Reject validation', 422);
                    await frame
                        .locator('[data-action-outcome]')
                        .getByText(/validation\. Commit unknown/)
                        .waitFor();
                    const cancelled = writes.length;
                    await frame
                        .getByRole('button', { name: 'Cancel before dispatch', exact: true })
                        .click();
                    await frame
                        .locator('[data-action-outcome]')
                        .getByText(/rejected\. Commit not_started/)
                        .waitFor();
                    assert.equal(writes.length, cancelled);
                    const before = writes.length;
                    await frame
                        .getByRole('button', { name: 'Reject string record ID', exact: true })
                        .click();
                    await frame
                        .locator('[data-action-outcome]')
                        .getByText(/rejected\. Commit not_started/)
                        .waitFor();
                    assert.equal(writes.length, before);
                    const accepted = await dispatch('Save JSON', 200);
                    assert.equal((await accepted.json()).count, 1);
                    assert.equal(
                        (await accepted.request().allHeaders())['x-dapter-transport'],
                        'http',
                    );
                    assert((await accepted.request().allHeaders())['x-xsrf-token']);
                    assert.equal(new URL(page.url()).pathname, '/docs/dapter/actions');
                    await frame.getByText('Borrowed view counter 0.', { exact: true }).waitFor();
                    let read = page.waitForResponse((response) =>
                        response.url().includes('/dapter/data/Dapter.ActionCatalog'),
                    );
                    await frame
                        .getByRole('button', { name: 'Explicitly reload rows', exact: true })
                        .click();
                    await read;
                    await frame.getByText('Borrowed view counter 1.', { exact: true }).waitFor();
                    await dispatch('Write then return 422', 422);
                    await frame
                        .locator('[data-action-outcome]')
                        .getByText(/validation\. Commit unknown/)
                        .waitFor();
                    read = page.waitForResponse((response) =>
                        response.url().includes('/dapter/data/Dapter.ActionCatalog'),
                    );
                    await frame
                        .getByRole('button', { name: 'Explicitly reload rows', exact: true })
                        .click();
                    assert.equal((await (await read).json()).data[0].writes, 2);
                    const lostUrl = '**/dapter/actions/Dapter.ActionCatalog/save';
                    await page.route(lostUrl, async (route) => {
                        await route.fetch();
                        await route.abort('failed');
                    });
                    await frame.getByRole('button', { name: 'Save JSON', exact: true }).click();
                    await frame
                        .locator('[data-action-outcome]')
                        .getByText(/failed\. Commit unknown/)
                        .waitFor();
                    await page.unroute(lostUrl);
                    read = page.waitForResponse((response) =>
                        response.url().includes('/dapter/data/Dapter.ActionCatalog'),
                    );
                    await frame
                        .getByRole('button', { name: 'Explicitly reload rows', exact: true })
                        .click();
                    assert.equal((await (await read).json()).data[0].writes, 3);
                    const revocation = page.waitForResponse((response) =>
                        response.url().includes('/demo/dapter/actions/revoke'),
                    );
                    await frame
                        .getByRole('button', { name: 'Revoke fictional permission', exact: true })
                        .click();
                    await revocation;
                    await dispatch('Save JSON', 403);
                    read = page.waitForResponse((response) =>
                        response.url().includes('/dapter/data/Dapter.ActionCatalog'),
                    );
                    await frame
                        .getByRole('button', { name: 'Explicitly reload rows', exact: true })
                        .click();
                    assert.equal((await (await read).json()).actions, undefined);
                    await frame.getByRole('button', { name: 'Save JSON', exact: true }).waitFor();
                    assert.equal(
                        await frame
                            .getByRole('button', { name: 'Save JSON', exact: true })
                            .isDisabled(),
                        true,
                    );
                    await frame
                        .getByRole('button', { name: 'Dispose action owner', exact: true })
                        .click();
                    await frame.locator('[data-action-session]').waitFor({ state: 'detached' });
                }
                await page.goto(new URL('/docs/dapter/action-declarations', base).href);
                const external = page.locator('[data-action-demo="external"]').first();
                await external
                    .getByRole('button', { name: 'Start action demo', exact: true })
                    .click();
                await external.getByText('Borrowed view counter 0.', { exact: true }).waitFor();
                for (const [id, verb] of [
                    ['replace', 'PUT'],
                    ['amend', 'PATCH'],
                    ['remove', 'DELETE'],
                ]) {
                    const next = page.waitForResponse((response) =>
                        response.url().includes('/dapter/actions/Dapter.ActionExternal/' + id),
                    );
                    await external.getByRole('button', { name: id + ' JSON', exact: true }).click();
                    const response = await next;
                    assert.equal(response.status(), 200);
                    assert.equal(response.request().method(), verb);
                }
                const visit = page.waitForResponse((response) =>
                    response.url().includes('/dapter/actions/Dapter.ActionExternal/defaultVisit'),
                );
                await external
                    .getByRole('button', { name: 'Save with native visit', exact: true })
                    .click();
                const redirected = await visit;
                assert.equal(redirected.request().method(), 'POST');
                assert.equal(redirected.status(), 302);
                assert.equal((await redirected.request().allHeaders())['x-inertia'], 'true');
                await page.waitForURL((url) => url.pathname === '/docs/dapter/actions');
                assert.deepEqual(errors, []);
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
                    false,
                );
                await page.screenshot({
                    path: resolve(artifacts, `${width}-${theme}.png`),
                    fullPage: true,
                });
                results.push({ width, theme, writes: writes.length, errors });
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
    await writeFile(resolve(artifacts, 'summary.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(
        'Verified real v1/v2 same-handle native writes, JSON and CSRF, record rejection, validation, unknown commit, revocation, all verbs, native redirect, and four production layouts.',
    );
} finally {
    await browser.close();
}

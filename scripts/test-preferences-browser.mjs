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
const artifacts = resolve(import.meta.dirname, '../storage/app/browser-verification');
await mkdir(artifacts, { recursive: true });
let checked = 0;

try {
    for (const width of [1440, 390]) {
        const context = await browser.newContext({
            viewport: { width, height: 1000 },
            colorScheme: 'light',
            locale: 'es-ES',
        });
        await context.routeWebSocket('**', () => {});
        await context.route('**/_boost/browser-logs', (route) => route.fulfill({ status: 204 }));
        await context.addInitScript(() => localStorage.setItem('appearance', 'dark'));
        const page = await context.newPage();
        const errors = [];
        const mutations = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('request', (request) => {
            if (request.method() === 'PATCH') mutations.push(request);
        });
        const path = '/docs/front-awesome/preferences?example=kept#preferences-demo';
        await page.goto(new URL(path, base).href);
        const demo = page.locator('[data-preferences-demo]');
        await demo.waitFor({ state: 'visible' });
        const language = demo.getByLabel('Language', { exact: true });
        const timezone = demo.getByLabel('Display timezone', { exact: true });
        await language.waitFor({ state: 'visible' });
        assert.equal(await language.inputValue(), 'es');
        assert.equal(await demo.locator('[data-preference-appearance]').textContent(), 'system');
        assert.equal(
            await page.locator('html').evaluate((node) => node.classList.contains('dark')),
            false,
        );
        await demo.getByLabel('Local component state').fill('keep this value');
        await page.evaluate(() => document.fonts.ready);
        const darkButton = demo.getByRole('button', { name: 'Dark', exact: true });
        await darkButton.scrollIntoViewIfNeeded();
        await page.evaluate(() => {
            document.addEventListener(
                'inertia:before',
                () => {
                    window.__preferenceVisitScroll = window.scrollY;
                },
                { once: true },
            );
        });

        await darkButton.click();
        await page.waitForFunction(
            () => document.querySelector('[data-preference-appearance]')?.textContent === 'dark',
        );
        assert.equal(
            await demo.getByLabel('Local component state').inputValue(),
            'keep this value',
        );
        assert.equal(new URL(page.url()).search, '?example=kept');
        assert.equal(new URL(page.url()).hash, '#preferences-demo');
        const scroll = await page.evaluate(() => window.__preferenceVisitScroll);
        const confirmedScroll = await page.evaluate(() => window.scrollY);
        assert(
            Math.abs(confirmedScroll - scroll) < 2,
            `Expected scroll ${scroll}, received ${confirmedScroll}.`,
        );
        assert.equal(mutations.at(-1).headers()['x-inertia'], 'true');
        assert.equal(
            mutations.at(-1).headers()['x-front-awesome-return'],
            '/docs/front-awesome/preferences?example=kept',
        );

        await language.selectOption('pt-BR');
        await page.waitForFunction(() => document.documentElement.lang === 'pt-BR');
        await timezone.selectOption('America/Sao_Paulo');
        await page.waitForFunction(
            () =>
                document.querySelector('#preference-timezone')?.value === 'America/Sao_Paulo' &&
                !document.querySelector('#preference-timezone')?.disabled,
        );
        const expectedDate = await page.evaluate(() =>
            new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'America/Sao_Paulo',
            }).format(new Date('2026-11-10T12:00:00Z')),
        );
        assert.equal(
            (await demo.locator('[data-preference-date]').textContent()).trim(),
            expectedDate,
        );
        const currency = demo.getByLabel('Currency', { exact: true });
        await currency.selectOption('BRL');
        await page.waitForFunction(
            () =>
                document.querySelector('#preference-currency')?.value === 'BRL' &&
                !document.querySelector('#preference-currency')?.disabled,
        );
        const expectedMoney = await page.evaluate(() =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(1234.5),
        );
        assert.equal(
            (await demo.locator('[data-preference-money]').textContent()).trim(),
            expectedMoney,
        );
        await page.reload();
        await demo.waitFor({ state: 'visible' });
        assert.equal(await language.inputValue(), 'pt-BR');
        assert.equal(await timezone.inputValue(), 'America/Sao_Paulo');
        assert.equal(await currency.inputValue(), 'BRL');
        assert.equal(await demo.locator('[data-preference-appearance]').textContent(), 'dark');
        assert.equal(await page.evaluate(() => localStorage.getItem('appearance')), 'dark');
        assert(!(await context.cookies()).some((cookie) => cookie.name === 'appearance'));
        await currency.selectOption('');
        await page.waitForFunction(
            () =>
                document.querySelector('#preference-currency')?.value === '' &&
                !document.querySelector('#preference-currency')?.disabled,
        );
        assert.equal(JSON.parse(mutations.at(-1).postData()).currency, null);
        const expectedDecimal = await page.evaluate(() =>
            new Intl.NumberFormat('pt-BR').format(1234.5),
        );
        assert.equal(
            (await demo.locator('[data-preference-money]').textContent()).trim(),
            expectedDecimal,
        );

        const forged = await context.request.patch(
            new URL('/front-awesome/preferences', base).href,
            {
                headers: {
                    Accept: 'application/json',
                    'Sec-Fetch-Site': 'cross-site',
                    Origin: 'https://untrusted.invalid',
                    'X-Front-Awesome-Return': '/docs/front-awesome/preferences',
                },
                data: { appearance: 'light' },
            },
        );
        assert.equal(forged.status(), 419);

        await page.route('**/front-awesome/preferences', (route) => route.abort('failed'));
        await demo.getByRole('button', { name: 'Light', exact: true }).click();
        await demo.getByRole('alert').first().waitFor({ state: 'visible' });
        assert.equal(await demo.locator('[data-preference-appearance]').textContent(), 'dark');
        await page.unroute('**/front-awesome/preferences');
        await demo.getByRole('button', { name: 'Light', exact: true }).click();
        await page.waitForFunction(
            () => document.querySelector('[data-preference-appearance]')?.textContent === 'light',
        );
        await language.selectOption('en');
        await page.waitForFunction(() => document.documentElement.lang === 'en');
        await page.screenshot({ path: resolve(artifacts, `preferences-${width}.png`) });

        await page
            .locator('article')
            .getByRole('link', { name: 'language', exact: true })
            .first()
            .click();
        await page.waitForURL('**/docs/front-awesome/preferences/language');
        await page.goBack();
        await demo.waitFor({ state: 'visible' });
        await page.waitForFunction(
            () => document.querySelector('[data-preference-appearance]')?.textContent === 'light',
        );
        assert.equal(await language.inputValue(), 'en');
        assert.deepEqual(errors, []);
        checked++;
        await context.close();
    }
    console.log(
        `Checked ${checked} browser sessions: negotiation, Inertia persistence, state/scroll/query/fragment, reload, explicit timezone, CSRF, failure recovery, and history.`,
    );
} finally {
    await browser.close();
}

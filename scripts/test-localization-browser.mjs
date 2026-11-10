import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(
    base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname),
    'Use a local documentation application.',
);
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const artifacts = resolve(import.meta.dirname, '../storage/app/browser-verification');
await mkdir(artifacts, { recursive: true });
let checked = 0;

function storageSnapshot() {
    const entries = (storage) =>
        Object.fromEntries(Object.keys(storage).map((key) => [key, storage.getItem(key)]));
    return { local: entries(localStorage), session: entries(sessionStorage) };
}

try {
    for (const width of [1440, 390]) {
        const context = await browser.newContext({
            viewport: { width, height: 1000 },
            colorScheme: 'light',
        });
        await context.routeWebSocket('**', () => {});
        await context.route('**/_boost/browser-logs', (route) => route.fulfill({ status: 204 }));
        const page = await context.newPage();
        const errors = [];
        const actions = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(new URL('/docs/front-awesome/localization', base).href);
        const demo = page.locator('[data-localization-demo]');
        await demo.waitFor({ state: 'visible' });
        const storage = await page.evaluate(storageSnapshot);
        page.on('request', (request) => {
            const path = new URL(request.url()).pathname;
            if (request.method() !== 'GET' && path !== '/_boost/browser-logs')
                actions.push(`${request.method()} ${path}`);
        });
        page.on('websocket', (socket) => actions.push(`WebSocket ${socket.url()}`));

        for (const [locale, name, title, currency] of [
            ['es', 'Español', 'Imprimir documentos', 'EUR'],
            ['pt-BR', 'Português (Brasil)', 'Imprimir documentos', 'BRL'],
            ['en', 'English', 'Print documents', 'USD'],
        ]) {
            await demo.getByRole('button', { name, exact: true }).click();
            await page.waitForFunction(
                (value) =>
                    document.documentElement.lang === value &&
                    document.querySelector('[data-demo-locale]').textContent === value,
                locale,
            );
            assert.equal(await demo.locator('[data-demo-message]').innerText(), title);
            const expected = await page.evaluate(
                ({ locale, currency }) => ({
                    number: new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
                        1234.5,
                    ),
                    date: new Intl.DateTimeFormat(locale, {
                        dateStyle: 'short',
                        timeZone: 'UTC',
                    }).format(new Date('2026-11-10T12:00:00Z')),
                }),
                { locale, currency },
            );
            assert.equal(
                (await demo.locator('[data-demo-number]').textContent()).trim(),
                expected.number,
            );
            assert.equal(
                (await demo.locator('[data-demo-date]').textContent()).trim(),
                expected.date,
            );
            checked++;
        }
        await page.evaluate(() => {
            document.documentElement.lang = 'pt_BR';
        });
        await page.waitForFunction(
            () => document.querySelector('[data-demo-locale]').textContent === 'pt-BR',
        );
        assert.equal(
            await page
                .getByRole('heading', { name: 'Translate the browser from Laravel', exact: true })
                .count(),
            1,
        );
        assert.deepEqual(
            (await page.evaluate(storageSnapshot)).local,
            storage.local,
            'Language selection does not write localStorage.',
        );
        assert.deepEqual(
            actions,
            Array(3).fill('PATCH /front-awesome/preferences'),
            'Each language selection persists through one Inertia request.',
        );
        await demo.scrollIntoViewIfNeeded();
        await page.screenshot({ path: resolve(artifacts, `localization-${width}.png`) });
        const next = page.locator('article a').filter({ hasText: 'Vue plugin registration' });
        await next.click();
        await page.waitForURL('**/docs/front-awesome/vue-plugin');
        await page.waitForFunction(() => document.documentElement.getAttribute('lang') === 'en');
        assert.deepEqual(errors, [], 'The live example has no browser errors.');
        await context.close();
    }
    console.log(
        `Checked ${checked} persisted localization selections, external HTML updates, localStorage isolation, and navigation at desktop and mobile widths.`,
    );
} finally {
    await browser.close();
}

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

try {
    for (const width of [1440, 390]) {
        const context = await browser.newContext({
            locale: 'en-US',
            viewport: { width, height: 1000 },
            colorScheme: 'light',
        });
        const page = await context.newPage();
        const errors = [];
        let documentRequests = 0;
        let qzRequests = 0;
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'warning' && message.text().includes('Duplicate keys'))
                errors.push(message.text());
        });
        page.on('request', (request) => {
            if (new URL(request.url()).pathname === '/demo/front-awesome/printing/documents')
                documentRequests++;
            if (new URL(request.url()).pathname.startsWith('/qztray-connector/')) qzRequests++;
        });
        page.on('websocket', (socket) => {
            const url = new URL(socket.url());
            if (['8181', '8182', '8282', '8283', '8383', '8384', '8484', '8485'].includes(url.port))
                qzRequests++;
        });
        await page.goto(new URL('/docs/front-awesome/printing', base).href);
        const open = page.getByRole('button', { name: 'Open print demonstration', exact: true });
        await open.waitFor({ state: 'visible' });
        assert.equal(documentRequests, 0, 'Mounting the page does not generate documents.');
        async function choosePrinter(drawer, remembered) {
            const printer = drawer.getByRole('combobox', { name: 'Printer', exact: true });
            if (remembered) {
                assert.equal(
                    await printer.evaluate((element) => element.value),
                    'Demonstration printer',
                    'Each format restores its last printer without another selection.',
                );
                return;
            }
            await printer.click();
            await page.getByRole('option', { name: 'Demonstration printer', exact: true }).click();
            await page
                .getByRole('option', { name: 'Demonstration printer', exact: true })
                .waitFor({ state: 'hidden' });
        }
        for (const theme of ['light', 'dark']) {
            await page.getByRole('combobox', { name: 'Color theme' }).click();
            await page
                .getByRole('option', { name: theme === 'light' ? 'Light' : 'Dark', exact: true })
                .click();
            await open.click();
            const drawer = page.locator('.front-awesome-print-drawer');
            await drawer
                .getByRole('img', { name: 'Receipt, Page 1', exact: true })
                .waitFor({ state: 'visible' });
            await choosePrinter(drawer, theme === 'dark');
            await page.waitForFunction(
                () =>
                    !document
                        .querySelector('.front-awesome-print-drawer')
                        .shadowRoot.querySelector('dialog')
                        .getAnimations()
                        .some((animation) => animation.playState === 'running'),
            );
            await page.screenshot({ path: resolve(artifacts, `printing-${width}-${theme}.png`) });
            const send = drawer.getByRole('button', {
                name: 'Simulate sending document',
                exact: true,
            });
            await send.click();
            await drawer
                .getByRole('img', { name: 'Invoice and packing list, Page 1', exact: true })
                .waitFor({ state: 'visible' });
            assert(
                (await drawer.innerText()).includes('Page 1 of 2'),
                'PDF has two real preview pages.',
            );
            await drawer.getByRole('button', { name: 'Next page', exact: true }).click();
            await drawer
                .getByRole('img', { name: 'Invoice and packing list, Page 2', exact: true })
                .waitFor({ state: 'visible' });
            await choosePrinter(drawer, theme === 'dark');
            await send.click();
            await drawer
                .getByRole('img', { name: 'Shipping label, Page 1', exact: true })
                .waitFor({ state: 'visible' });
            await choosePrinter(drawer, theme === 'dark');
            await send.click();
            await drawer.locator('dialog').waitFor({ state: 'hidden' });
            assert.equal(
                await drawer.getByRole('heading', { name: 'Job summary', exact: true }).count(),
                0,
                'The default flow does not show a final report.',
            );
            assert.equal(
                await page.getByRole('list', { name: 'Demonstration results' }).count(),
                0,
                'The default demonstration does not render a second report outside the drawer.',
            );
            checked++;
        }
        await page.getByText('Show final report', { exact: true }).click();
        await open.click();
        const reportDrawer = page.locator('.front-awesome-print-drawer');
        for (const title of ['Receipt', 'Invoice and packing list', 'Shipping label']) {
            await reportDrawer
                .getByRole('img', { name: `${title}, Page 1`, exact: true })
                .waitFor({ state: 'visible' });
            await reportDrawer
                .getByRole('button', { name: 'Simulate sending document', exact: true })
                .click();
        }
        await reportDrawer
            .getByRole('heading', { name: 'Job summary', exact: true })
            .waitFor({ state: 'visible' });
        const summaryGeometry = await reportDrawer.evaluate((element) => {
            const list = element.querySelector('.print-results');
            return {
                gap: Number.parseFloat(getComputedStyle(list).rowGap),
                width: element.shadowRoot.querySelector('dialog').getBoundingClientRect().width,
                height: list.getBoundingClientRect().height,
            };
        });
        assert(summaryGeometry.gap <= 24, 'Prose rules cannot inflate the summary row gaps.');
        if (width > 700)
            assert(summaryGeometry.width < 720, 'Explicit reports use a compact desktop panel.');
        assert(summaryGeometry.height < 400, 'Report results stay grouped together.');
        await page.screenshot({ path: resolve(artifacts, `printing-summary-${width}.png`) });
        await reportDrawer.getByRole('button', { name: 'Done', exact: true }).click();
        await reportDrawer.locator('dialog').waitFor({ state: 'hidden' });
        assert.equal(
            await page
                .getByRole('list', { name: 'Demonstration results' })
                .getByRole('listitem')
                .count(),
            3,
        );
        await page.getByText('Show final report', { exact: true }).click();
        await page.getByRole('button', { name: 'Simulate failures', exact: true }).click();
        await page.getByText('Simulate connection failure', { exact: true }).click();
        await open.click();
        const drawer = page.locator('.front-awesome-print-drawer');
        await drawer
            .locator('.print-connection')
            .getByText('The simulated connection is unavailable.', { exact: false })
            .waitFor({ state: 'visible' });
        await page.keyboard.press('Escape');
        await drawer.locator('dialog').waitFor({ state: 'hidden' });
        await open.waitFor({ state: 'visible' });
        await page.getByText('Simulate connection failure', { exact: true }).click();
        await page.getByText('Simulate missing submission response', { exact: true }).click();
        await open.click();
        await drawer.getByRole('button', { name: 'Reconnect', exact: true }).click();
        await drawer
            .getByRole('img', { name: 'Receipt, Page 1', exact: true })
            .waitFor({ state: 'visible' });
        await drawer
            .getByRole('button', { name: 'Simulate sending document', exact: true })
            .click();
        await drawer
            .getByText('The submission outcome is unknown.', { exact: false })
            .waitFor({ state: 'visible' });
        assert.equal(
            await drawer
                .getByRole('button', { name: 'Simulate sending document', exact: true })
                .count(),
            0,
            'An uncertain result has no retry submission control.',
        );
        await drawer.getByRole('button', { name: 'Cancel job', exact: true }).click();
        await drawer.getByRole('button', { name: 'Done', exact: true }).click();
        assert.equal(qzRequests, 0, 'The demonstration never contacts QZ signing or submission.');
        assert.equal(documentRequests, 4, 'Each mixed job shares exactly one document request.');
        assert.deepEqual(
            errors,
            [],
            'The full consumer flow has no page or duplicate-slot errors.',
        );
        await context.close();
    }
    console.log(
        `Verified ${checked} mixed-format print jobs, real PHP/PNG previews, two PDF pages, connection recovery, uncertain outcomes, and zero QZ requests.`,
    );
} finally {
    await browser.close();
}

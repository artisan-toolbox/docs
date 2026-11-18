import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
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
            });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', (error) => errors.push(error.message));
            await page.goto(new URL('/docs/front-awesome/web-awesome/components/forms', base).href);
            const frame = page.locator('[data-catalog-demo="OtpInput"]');
            const host = frame.locator('wa-otp-input');
            await host.waitFor();
            await host.evaluate(async (element) => {
                await customElements.whenDefined('wa-otp-input');
                await element.updateComplete;
            });
            const hints = await host.evaluate((element) => ({
                name: element.name,
                id: element.id,
                autocomplete: element.input.autocomplete,
                inputmode: element.input.inputMode,
                type: element.input.type,
                inputs: element.shadowRoot.querySelectorAll('input').length,
            }));
            assert.deepEqual(hints, {
                name: 'verification_code',
                id: 'otp-example-code',
                autocomplete: 'one-time-code',
                inputmode: 'numeric',
                type: 'text',
                inputs: 1,
            });
            for (const mode of ['noncomposed-input', 'change-only', 'host-value']) {
                await host.evaluate((element, fillMode) => {
                    if (fillMode === 'host-value') {
                        element.value = '001234';
                    } else {
                        element.input.value = '001234';
                        element.input.dispatchEvent(
                            new Event(fillMode === 'change-only' ? 'change' : 'input', {
                                bubbles: true,
                                composed: false,
                            }),
                        );
                    }
                }, mode);
                await frame.getByRole('button', { name: 'Submit example', exact: true }).click();
                await frame
                    .getByText('Submitted code: 001234. No request was sent.', { exact: true })
                    .waitFor();
                assert.match(
                    await frame
                        .locator('#otp-example-form output[aria-live]')
                        .first()
                        .textContent(),
                    /001234/,
                );
                await frame.getByRole('button', { name: 'Reset', exact: true }).click();
                await page.waitForFunction(() => {
                    const element = document.querySelector(
                        '[data-catalog-demo="OtpInput"] wa-otp-input',
                    );
                    return element?.value === '';
                });
                assert.equal(
                    await frame
                        .locator('#otp-example-form output')
                        .filter({ hasText: 'Submitted code:' })
                        .count(),
                    0,
                );
            }
            assert.deepEqual(errors, []);
            results.push({
                width,
                theme,
                recognitionHints: true,
                fillModes: 3,
                leadingZeros: true,
                reset: true,
            });
            await context.close();
        }
    }
    console.log(
        JSON.stringify(
            { results, providerExtensionsTested: false, smsTransportTested: false },
            null,
            2,
        ),
    );
} finally {
    await browser.close();
}

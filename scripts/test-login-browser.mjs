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
const email = 'you@atb.dev.br';
const status = 'A sign-in code has been sent to your email address.';
const invalidCode = 'The sign-in code is invalid or has expired.';

try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            await context.addInitScript(
                (value) => localStorage.setItem('appearance', value),
                theme,
            );
            await context.addInitScript(() => {
                window.signInValidation = [];
                document.addEventListener('wa-invalid', (event) =>
                    window.signInValidation.push(event.target.name),
                );
            });
            const page = await context.newPage();
            const errors = [];
            const requests = [];
            const responses = [];
            const releases = [];
            let initialPage;
            page.on('pageerror', (error) => errors.push(error.message));
            await page.route('**/login{,/email}', async (route) => {
                const request = route.request();
                if (request.method() !== 'POST') return route.continue();
                const response = responses.shift();
                requests.push({
                    path: new URL(request.url()).pathname,
                    payload: request.postDataJSON(),
                });
                if (!response) {
                    errors.push(
                        'Unexpected sign-in submission. No authentication request was sent to the server.',
                    );
                    return route.abort();
                }
                response.enter();
                await response.released;
                await route.fulfill({
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Inertia': 'true',
                        Vary: 'X-Inertia',
                    },
                    body: JSON.stringify({
                        ...initialPage,
                        url: '/login',
                        props: {
                            ...initialPage.props,
                            pendingEmail: null,
                            status: null,
                            errors: {},
                            ...response.props,
                        },
                    }),
                });
            });

            function respond(props) {
                let enter;
                let release;
                const entered = new Promise((done, reject) => {
                    const timeout = setTimeout(
                        () => reject(new Error('Expected sign-in request was not submitted.')),
                        10000,
                    );
                    enter = () => {
                        clearTimeout(timeout);
                        done();
                    };
                });
                const released = new Promise((done) => {
                    release = done;
                });
                releases.push(release);
                responses.push({ props, enter, released });
                return { entered, release };
            }

            async function screenshot(state) {
                const overflow = await page.evaluate(
                    () => document.documentElement.scrollWidth - innerWidth,
                );
                assert(overflow <= 1, `No sign-in overflow at ${width}px in ${state}.`);
                await page.screenshot({
                    path: resolve(artifacts, `login-${state}-${width}-${theme}.png`),
                });
            }

            async function focus(input) {
                await input.waitFor();
                await page.waitForFunction(
                    (name) => {
                        const host = document.getElementById(name);
                        return (
                            host?.shadowRoot?.activeElement?.matches('input') ||
                            host?.matches('input:focus')
                        );
                    },
                    await input.getAttribute('name'),
                );
            }

            async function blocked(input, value, validity) {
                await input.fill(value);
                await input.evaluate(async (node) => {
                    await node.getRootNode().host?.updateComplete;
                });
                const count = requests.length;
                const invalidCount = await page.evaluate(() => window.signInValidation.length);
                await input.press('Enter');
                await page.waitForFunction(
                    (count) => window.signInValidation.length > count,
                    invalidCount,
                    { timeout: 10000 },
                );
                assert(
                    await input.evaluate((node, key) => node.validity[key], validity),
                    `${validity} prevents submission.`,
                );
                assert.equal(
                    requests.length,
                    count,
                    'Native validation prevents a sign-in request.',
                );
            }

            async function processing(input, label) {
                await page.getByRole('button', { name: label, exact: true }).waitFor();
                assert(await input.isDisabled(), 'The input is disabled during the request.');
                for (const button of await page.getByRole('button').all()) {
                    assert(
                        await button.isDisabled(),
                        'Every sign-in action is disabled during the request.',
                    );
                }
            }

            try {
                await page.goto(new URL('/login', base).href);
                initialPage = await page.evaluate(() =>
                    JSON.parse(
                        document.getElementById('app')?.getAttribute('data-page') ??
                            document.querySelector('script[data-page="app"]')?.textContent,
                    ),
                );
                assert.equal(initialPage.component, 'auth/Login');
                await page.waitForFunction(
                    (value) => document.documentElement.classList.contains(`wa-${value}`),
                    theme,
                );
                const emailInput = page.getByRole('textbox', { name: /^Email address/ });
                const codeInput = page.getByRole('textbox', { name: /^Sign-in code/ });
                await focus(emailInput);
                await screenshot('email');
                await blocked(emailInput, '', 'valueMissing');
                await blocked(emailInput, 'not-an-email', 'typeMismatch');

                const emailError = respond({
                    errors: { email: 'Use your @atb.dev.br email address to sign in.' },
                });
                await emailInput.fill('you@example.com');
                await page.getByRole('button', { name: 'Send sign-in code', exact: true }).click();
                await emailError.entered;
                emailError.release();
                await page
                    .getByRole('alert')
                    .filter({ hasText: 'Use your @atb.dev.br email address to sign in.' })
                    .waitFor();
                await screenshot('email-error');

                const sent = respond({ pendingEmail: email, status });
                await emailInput.fill(email);
                await emailInput.press('Enter');
                await sent.entered;
                await processing(emailInput, 'Sending code...');
                assert.deepEqual(requests.at(-1), { path: '/login/email', payload: { email } });
                sent.release();
                await focus(codeInput);
                assert.equal(await codeInput.inputValue(), '', 'A newly issued code starts empty.');
                await screenshot('code');
                await blocked(codeInput, '', 'valueMissing');
                await blocked(codeInput, '12345', 'patternMismatch');
                await blocked(codeInput, 'a12345', 'patternMismatch');
                await codeInput.fill('');
                await codeInput.pressSequentially('0012347');
                assert.equal(
                    await codeInput.inputValue(),
                    '001234',
                    'The code input limits typed codes to six characters.',
                );

                const rejected = respond({ pendingEmail: email, errors: { code: invalidCode } });
                await page.getByRole('button', { name: 'Sign in', exact: true }).click();
                await rejected.entered;
                await processing(codeInput, 'Signing in...');
                assert.deepEqual(requests.at(-1), { path: '/login', payload: { code: '001234' } });
                rejected.release();
                await page.getByRole('alert').filter({ hasText: invalidCode }).waitFor();
                assert.equal(
                    await codeInput.inputValue(),
                    '001234',
                    'A rejected code preserves the exact entered value.',
                );
                await screenshot('code-error');

                const throttled = respond({
                    pendingEmail: email,
                    errors: { email: 'Please wait before requesting another code.' },
                });
                await page.getByRole('button', { name: 'Send a new code', exact: true }).click();
                await throttled.entered;
                assert.deepEqual(requests.at(-1), { path: '/login/email', payload: { email } });
                throttled.release();
                await page
                    .getByText('Please wait before requesting another code.', { exact: true })
                    .waitFor();
                const resent = respond({ pendingEmail: email, status });
                await page.getByRole('button', { name: 'Send a new code', exact: true }).click();
                await resent.entered;
                resent.release();
                await page.waitForFunction(() => document.getElementById('code')?.value === '');
                assert.equal(
                    await page.getByRole('alert').count(),
                    0,
                    'A new code clears previous validation hints.',
                );

                await page.getByRole('button', { name: 'Change email', exact: true }).click();
                await focus(emailInput);
                assert.equal(
                    await emailInput.inputValue(),
                    email,
                    'Changing email retains the current address.',
                );
                const changed = respond({ pendingEmail: email, status });
                await emailInput.press('Enter');
                await changed.entered;
                changed.release();
                await focus(codeInput);

                const expired = respond({ errors: { code: invalidCode } });
                await codeInput.fill('001234');
                await codeInput.press('Enter');
                await expired.entered;
                expired.release();
                await focus(emailInput);
                assert.equal(
                    await codeInput.count(),
                    0,
                    'An expired challenge returns to the email step.',
                );
                assert.equal(
                    await emailInput.inputValue(),
                    email,
                    'Expiration keeps the address ready for another request.',
                );
                await page.getByText(invalidCode, { exact: true }).waitFor();
                await screenshot('expired');

                assert.equal(responses.length, 0, 'Every mocked response was exercised.');
                assert.deepEqual(
                    errors,
                    [],
                    'No uncaught browser exceptions or unexpected submissions.',
                );
                results.push({
                    width,
                    theme,
                    requests: requests.length,
                    validation: 'required, email, six-digit pattern, maximum length',
                    focus: 'initial, issued code, changed email, expired challenge',
                    submissions:
                        'Enter and button, exact leading-zero code, disabled while pending',
                    errors: 'email, code, resend, expired challenge',
                    overflow: 'none',
                    browserErrors: errors,
                });
            } catch (error) {
                await screenshot('failure');
                console.error(
                    JSON.stringify(
                        {
                            width,
                            theme,
                            requests,
                            errors,
                            focused: await page.evaluate(() => ({
                                host: document.activeElement?.id,
                                native: document.activeElement?.shadowRoot?.activeElement
                                    ?.outerHTML,
                            })),
                            accessibility: await page.locator('body').ariaSnapshot(),
                        },
                        null,
                        2,
                    ),
                );
                throw error;
            } finally {
                for (const release of releases) release();
                await context.close();
            }
        }
    }
    console.log(JSON.stringify({ results, screenshots: artifacts }, null, 2));
} finally {
    await browser.close();
}

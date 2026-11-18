import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const literalCases = JSON.parse(await readFile('app/Demo/Dapter/Literal/cases.json', 'utf8'));
const researchCases = JSON.parse(await readFile('app/Demo/Dapter/Research/cases.json', 'utf8'));
const foldedIds = [1, 2, 3, 4, 5, 6, 7];
const literalPolicies = {
    LiteralDefault: false,
    LiteralStrictFluent: true,
    LiteralStrictAttribute: true,
    LiteralSqlite: false,
    LiteralConfigured: true,
    LiteralFalseOverride: false,
    LiteralCustomDriver: false,
};
assert.deepEqual(
    literalCases.map((example) => example.id).sort(),
    Object.keys(literalPolicies).sort(),
);
assert.deepEqual(researchCases.map((example) => example.id).sort(), [
    'SnapshotRejected',
    'VectorRejected',
]);
const cases = [...literalCases, ...researchCases];
const guides = [...new Set([...cases.map((example) => example.guide), 'dapter/research'])];
const artifacts = resolve('storage/app/browser-verification/dapter-literal-research');
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const summary = [];

try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            await context.routeWebSocket('**', () => {});
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            const page = await context.newPage();
            const errors = [];
            const reads = [];
            const verified = [];
            const globalVerified = [];
            const preservedInputs = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('console', (message) => {
                if (message.type() !== 'error') return;
                const expectedRefusal =
                    new URL(message.location().url || base.href).pathname ===
                        '/dapter/data/Dapter.LiteralDefault' &&
                    /Failed to load resource:.*422/.test(message.text());
                if (!expectedRefusal) errors.push(message.text());
            });
            page.on('requestfailed', (request) =>
                errors.push(`${request.url()} ${request.failure()?.errorText}`),
            );
            page.on('request', (request) => {
                if (new URL(request.url()).pathname.startsWith('/dapter/data/')) {
                    assert.equal(request.method(), 'POST');
                    reads.push(request);
                }
            });

            try {
                for (const guide of guides) {
                    const before = reads.length;
                    const navigation = await page.goto(new URL(`/docs/${guide}`, base).href);
                    assert.equal(navigation.status(), 200, `${guide} must be available.`);
                    await page.locator('[data-document-content]').waitFor();
                    await page.waitForLoadState('networkidle');
                    assert.equal(reads.length, before, 'Opening a guide must not read records.');
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((nodes) => nodes.map((node) => node.src));
                    assert(
                        scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)),
                        'Verify the hashed production build.',
                    );
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                    assert.equal(
                        await page.evaluate(() =>
                            document.documentElement.classList.contains('dark'),
                        ),
                        theme === 'dark',
                        'The requested appearance must be active.',
                    );

                    for (const example of cases.filter((item) => item.guide === guide)) {
                        const literal = Object.hasOwn(literalPolicies, example.id);
                        const attribute = literal
                            ? 'data-literal-scenario'
                            : 'data-research-scenario';
                        const scope = page.locator(`[${attribute}="${example.id}"]`);
                        await scope.waitFor();
                        const fixed = scope.locator('pre[aria-label="Fixed version 2 request"]');
                        assert.deepEqual(JSON.parse(await fixed.innerText()), example.request);
                        if (literal) {
                            assert.deepEqual(example.request.state.fields.name.search, {
                                value: 'joao',
                                matchType: 'contains',
                            });
                        }
                        const count = reads.length;
                        const pending = page.waitForResponse(
                            (response) =>
                                response.request().method() === 'POST' &&
                                new URL(response.url()).pathname ===
                                    `/dapter/data/${example.source}`,
                        );
                        await scope.getByRole('button', { name: 'Start', exact: true }).click();
                        const response = await pending;
                        assert.equal(
                            response.status(),
                            literal ? 200 : 422,
                            `${example.id} status`,
                        );
                        assert.deepEqual(response.request().postDataJSON(), example.request);
                        const body = await response.json();
                        await scope
                            .getByText(`Received HTTP ${response.status()}.`, { exact: false })
                            .waitFor();
                        assert.equal(reads.length, count + 1, 'Start sends exactly one request.');
                        assert.deepEqual(
                            JSON.parse(
                                await scope
                                    .locator('pre[aria-label="Actual version 2 response"]')
                                    .innerText(),
                            ),
                            body,
                            'The displayed response must equal the actual server result.',
                        );
                        if (literal) {
                            const ids = literalPolicies[example.id] ? [7] : foldedIds;
                            assert.deepEqual(
                                body.data.map((row) => row.id),
                                ids,
                            );
                            assert.equal(body.paging.total, 7);
                            assert.equal(body.paging.filtered, ids.length);
                            assert.equal(body.requested.fields.name.search.value, 'joao');
                            assert.equal(body.requested.fields.name.search.matchType, 'contains');
                            assert(
                                !/"(?:strictLiteralSearch|strict_literal_search|literalSearchPolicy)"\s*:/.test(
                                    JSON.stringify(body),
                                ),
                            );
                            const originalNames = [
                                'Joao',
                                'JOAO',
                                'João',
                                'JOÃO',
                                'JoÃo',
                                'Joa\u0303o',
                                'joao',
                            ];
                            for (const row of body.data) {
                                assert.equal(row.name, originalNames[row.id - 1]);
                                assert.equal(row.tenant, 1);
                            }
                        } else {
                            assert.equal(body.error.kind, 'unsupported_operation');
                            assert(!('data' in body));
                            assert(!('capabilities' in body));
                        }
                        await scope.screenshot({
                            path: resolve(artifacts, `${example.id}-${width}-${theme}.png`),
                        });
                        await scope.locator('details > summary').click();
                        const declaration = scope.locator(
                            `pre[aria-label="${example.source.split('.').at(-1)}.php"]`,
                        );
                        assert.equal(
                            await declaration.isVisible(),
                            true,
                            'The actual source is disclosed.',
                        );
                        assert.equal(
                            await declaration.textContent(),
                            await readFile(
                                `app/DataSources/Dapter/${example.source.split('.').at(-1)}.php`,
                                'utf8',
                            ),
                            'The disclosure must contain the current source declaration.',
                        );
                        if (example.id === 'LiteralFalseOverride') {
                            const parent = scope.locator(
                                'pre[aria-label="LiteralStrictAttribute.php"]',
                            );
                            assert((await parent.innerText()).includes('#[StrictLiteralSearch]'));
                            const child = await declaration.innerText();
                            assert(child.includes('extends LiteralStrictAttribute'));
                            assert(child.includes('strictLiteralSearch(false)'));
                        }
                        assert.equal(
                            await page.evaluate(
                                () => document.documentElement.scrollWidth > innerWidth,
                            ),
                            false,
                            'Disclosing source must not overflow the page.',
                        );
                        assert.equal(
                            reads.length,
                            count + 1,
                            'Viewing source must not read records.',
                        );
                        await scope.locator('details > summary').click();
                        await scope.getByRole('button', { name: 'Reset', exact: true }).click();
                        await scope
                            .getByText(
                                'Ready. Start sends the fixed request. Opening this page reads no records.',
                                { exact: true },
                            )
                            .waitFor();
                        assert.equal(
                            await scope
                                .locator('pre[aria-label="Actual version 2 response"]')
                                .count(),
                            0,
                        );
                        assert.equal(reads.length, count + 1, 'Reset must not read records.');
                        verified.push(example.id);

                        if (literal) {
                            const globalRequest = structuredClone(example.request);
                            globalRequest.state.fields = {};
                            globalRequest.state.global = { search: { value: 'joao' } };
                            const globalResult = await page.evaluate(
                                async ({ source, request }) => {
                                    const token = document.cookie
                                        .split('; ')
                                        .find((cookie) => cookie.startsWith('XSRF-TOKEN='));
                                    const response = await fetch(`/dapter/data/${source}`, {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                            ...(token
                                                ? {
                                                      'X-XSRF-TOKEN': decodeURIComponent(
                                                          token.slice('XSRF-TOKEN='.length),
                                                      ),
                                                  }
                                                : {}),
                                        },
                                        body: JSON.stringify(request),
                                    });
                                    return { status: response.status, body: await response.json() };
                                },
                                { source: example.source, request: globalRequest },
                            );
                            assert.equal(globalResult.status, 200, `${example.id} global status`);
                            assert.deepEqual(reads.at(-1).postDataJSON(), globalRequest);
                            assert.deepEqual(
                                globalResult.body.data.map((row) => row.id),
                                literalPolicies[example.id] ? [7] : foldedIds,
                            );
                            assert.equal(globalResult.body.paging.total, 7);
                            assert.equal(
                                globalResult.body.paging.filtered,
                                literalPolicies[example.id] ? 1 : 7,
                            );
                            assert.equal(globalResult.body.requested.global.search.value, 'joao');
                            globalVerified.push(example.id);

                            if (['LiteralDefault', 'LiteralStrictFluent'].includes(example.id)) {
                                for (const input of ['João', 'Joa\u0303o']) {
                                    for (const target of ['field', 'global']) {
                                        const request = structuredClone(
                                            target === 'field' ? example.request : globalRequest,
                                        );
                                        const search =
                                            target === 'field'
                                                ? request.state.fields.name.search
                                                : request.state.global.search;
                                        search.value = input;
                                        const cookies = await context.cookies(base.href);
                                        const token = cookies.find(
                                            (cookie) => cookie.name === 'XSRF-TOKEN',
                                        );
                                        const result = await context.request.post(
                                            new URL(`/dapter/data/${example.source}`, base).href,
                                            {
                                                data: JSON.stringify(request),
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                    ...(token
                                                        ? {
                                                              'X-XSRF-TOKEN': decodeURIComponent(
                                                                  token.value,
                                                              ),
                                                          }
                                                        : {}),
                                                },
                                            },
                                        );
                                        assert.equal(result.status(), 200);
                                        const actual = await result.json();
                                        const requested =
                                            target === 'field'
                                                ? actual.requested.fields.name.search
                                                : actual.requested.global.search;
                                        assert.equal(
                                            requested.value,
                                            input,
                                            'The server must preserve the original search text.',
                                        );
                                        assert.deepEqual(
                                            actual.data.map((row) => row.id),
                                            literalPolicies[example.id]
                                                ? [input === 'João' ? 3 : 6]
                                                : foldedIds,
                                        );
                                        preservedInputs.push({ id: example.id, target, input });
                                    }
                                }
                            }
                        }
                    }

                    assert.equal(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth,
                        ),
                        false,
                        `${guide} must not overflow.`,
                    );
                    await page.screenshot({
                        path: resolve(
                            artifacts,
                            `${guide.split('/').at(-1)}-${width}-${theme}.png`,
                        ),
                        fullPage: true,
                    });
                }
                assert.deepEqual(errors, []);
                summary.push({
                    width,
                    theme,
                    browserReads: reads.length,
                    verified,
                    globalVerified,
                    preservedInputs,
                    errors,
                });
            } finally {
                await context.close();
            }
        }
    }
} finally {
    await browser.close();
}

await writeFile(resolve(artifacts, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary));

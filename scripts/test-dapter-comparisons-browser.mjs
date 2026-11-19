import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const cases = JSON.parse(await readFile('app/Demo/Dapter/Comparisons/cases.json', 'utf8'));
const artifacts = resolve('storage/app/browser-verification/dapter-comparisons');
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
            const unavailable = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (new URL(request.url()).pathname.startsWith('/dapter/data/Dapter.Comparisons'))
                    reads.push(request.url());
            });

            try {
                for (const guide of new Set(cases.map((item) => item.guide))) {
                    const before = reads.length;
                    await page.goto(new URL(`/docs/${guide}`, base).href);
                    await page.locator('[data-comparison-scenario]').first().waitFor();
                    assert.equal(
                        reads.length,
                        before,
                        'Opening a comparison guide must not read records.',
                    );
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((nodes) => nodes.map((node) => node.src));
                    assert(
                        scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)),
                        'Verify the production build.',
                    );
                    assert(!scripts.some((src) => src.includes('/@vite/client')));

                    for (const example of cases.filter((item) => item.guide === guide)) {
                        const scope = page.locator(`[data-comparison-scenario="${example.id}"]`);
                        const start = scope.getByRole('button', { name: 'Start', exact: true });
                        const count = reads.length;
                        if (example.requiresPostgres && !(await start.isEnabled())) {
                            assert.notEqual(
                                process.env.DAPTER_REQUIRE_PGSQL_DEMOS,
                                '1',
                                `${example.id} requires the isolated native fixture for this verification.`,
                            );
                            await scope
                                .getByRole('status')
                                .filter({
                                    hasText:
                                        'This isolated PostgreSQL demo is unavailable on this installation.',
                                })
                                .waitFor();
                            assert.equal(
                                reads.length,
                                count,
                                'An unavailable native demo must not connect.',
                            );
                            unavailable.push(example.id);
                            continue;
                        }
                        assert.equal(
                            await start.isEnabled(),
                            true,
                            `${example.id} needs its documented prerequisites configured.`,
                        );
                        const pending = page.waitForResponse(
                            (response) =>
                                new URL(response.url()).pathname ===
                                `/dapter/data/${example.source}`,
                        );
                        await start.click();
                        const response = await pending;
                        assert.equal(
                            response.status(),
                            example.expected.status,
                            `${example.id} HTTP status`,
                        );
                        const body = await response.json();
                        await scope
                            .getByText(`Received HTTP ${response.status()}.`, { exact: false })
                            .waitFor();
                        assert.equal(
                            reads.length,
                            count + 1,
                            'One Start action sends exactly one read.',
                        );
                        assert.deepEqual(
                            JSON.parse(response.request().postData()),
                            example.request,
                        );

                        if (response.status() === 200) {
                            assert.deepEqual(
                                body.data.map((row) => row.id),
                                example.expected.ids,
                                `${example.id} records`,
                            );
                            assert.equal(body.paging.total, example.expected.total);
                            assert.equal(body.paging.filtered, example.expected.filtered);
                            const serialized = await scope
                                .locator('pre[aria-label="Actual version 2 response"]')
                                .innerText();
                            assert.deepEqual(
                                JSON.parse(serialized),
                                body,
                                'Rendered response must equal the actual server result.',
                            );

                            if (example.id.startsWith('Locale')) {
                                const policy = body.capabilities.fields.name.order.locale;
                                assert.equal(policy.locale, 'pt_BR');
                                assert.equal(policy.strength, 'tertiary');
                                assert.equal(policy.normalization, true);
                                assert.equal(policy.numeric, false);
                                assert(policy.icuVersion.length > 0);
                            }
                            if (example.requiresPostgres) {
                                const policy =
                                    example.id === 'PostgresGlobal'
                                        ? Object.values(body.capabilities.global.search.targets)[0]
                                              .fullText
                                        : body.capabilities.fields.title.search.fullText;
                                assert.deepEqual(policy, {
                                    engine: 'pgsql',
                                    configuration: 'pg_catalog.english',
                                    input: 'plain_text',
                                    maxBytes: 512,
                                    ranking: 'filter_only',
                                });
                                assert(
                                    body.data.every(
                                        (row) =>
                                            row.tenant_key === undefined ||
                                            row.tenant_key === 'docs-comparisons',
                                    ),
                                );
                            }
                        } else {
                            assert.equal(body.error.kind, example.expected.kind);
                            assert(!('data' in body));
                        }

                        verified.push(example.id);
                        await scope.screenshot({
                            path: resolve(artifacts, `${example.id}-${width}-${theme}.png`),
                        });
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
                            'Reset clears the previous response.',
                        );
                        assert.equal(reads.length, count + 1, 'Reset must not read records.');
                    }

                    assert.equal(
                        await page.evaluate(
                            () => document.documentElement.scrollWidth > innerWidth,
                        ),
                        false,
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
                summary.push({ width, theme, reads: reads.length, verified, unavailable, errors });
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

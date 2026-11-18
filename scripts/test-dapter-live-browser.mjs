import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const base = new URL(process.env.DOCS_BASE_URL ?? 'https://atb.test');
assert(base.hostname.endsWith('.test') || ['localhost', '127.0.0.1'].includes(base.hostname));
const artifacts = resolve('storage/app/browser-verification/dapter-live');
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE,
});
const summary = [];
/** @type {readonly (readonly [string, readonly string[]])[]} */
const guides = [
    ['resources', ['ResourceFluent', 'ResourceAttributes']],
    ['live-authorization', ['LiveAttributes', 'LiveShorthand', 'LivePublic']],
    ['live-updates', ['LivePrivate']],
    ['revision-races', ['LiveIdentity', 'LiveArrival', 'LiveNative']],
    ['polling', ['LivePolling', 'LivePollingProps']],
];
try {
    for (const width of [1440, 390])
        for (const theme of ['light', 'dark']) {
            const context = await browser.newContext({
                viewport: { width, height: 1000 },
                colorScheme: theme,
            });
            await context.route('**/_boost/browser-logs', (route) =>
                route.fulfill({ status: 204 }),
            );
            const page = await context.newPage();
            const errors = [],
                reads = [],
                frames = [],
                authorizations = [];
            page.on('pageerror', (error) => errors.push(error.message));
            page.on('request', (request) => {
                if (new URL(request.url()).pathname.startsWith('/dapter/data/Dapter.'))
                    reads.push(request);
            });
            page.on('response', (response) => {
                if (new URL(response.url()).pathname === '/broadcasting/auth')
                    authorizations.push({
                        body: response.request().postData() ?? '',
                        status: response.status(),
                    });
            });
            page.on('websocket', (socket) =>
                socket.on('framereceived', (frame) => {
                    try {
                        const value = JSON.parse(String(frame.payload));
                        if (typeof value.data === 'string') {
                            try {
                                value.data = JSON.parse(value.data);
                            } catch {}
                        }
                        frames.push(value);
                    } catch {}
                }),
            );
            try {
                for (const [guide, scenarios] of guides) {
                    const before = reads.length;
                    await page.goto(new URL(`/docs/dapter/${guide}`, base).href);
                    await page.locator('[data-demo-frame]').first().waitFor();
                    assert.equal(reads.length, before, 'Reading starts only after reader consent.');
                    const scripts = await page
                        .locator('script[src]')
                        .evaluateAll((nodes) => nodes.map((node) => node.src));
                    assert(scripts.some((src) => /\/build\/assets\/app-[^/]+\.js$/.test(src)));
                    assert(!scripts.some((src) => src.includes('/@vite/client')));
                    for (const scenario of scenarios) {
                        const resource = scenario.startsWith('Resource');
                        const polling = scenario.startsWith('LivePolling');
                        const scope = page.locator(
                            `[data-${resource ? 'resource' : 'live'}-demo="${scenario}"]`,
                        );
                        const responsePromise = page.waitForResponse(
                            (response) =>
                                new URL(response.url()).pathname ===
                                `/dapter/data/Dapter.${scenario}`,
                        );
                        await scope
                            .getByRole('button', { name: 'Start example', exact: true })
                            .click();
                        const response = await responsePromise;
                        assert.equal(response.status(), 200);
                        const initial = await response.json();
                        const rows = scope.locator(
                            resource ? '[data-resource-row]' : '[data-live-row]',
                        );
                        await rows.first().waitFor();
                        assert.equal(await rows.count(), initial.data.length);
                        if (resource) {
                            assert.equal(initial.version, 1);
                            assert(!Object.hasOwn(initial, 'metadata'));
                            assert(!Object.hasOwn(initial.data[0], 'id'));
                            assert(!Object.hasOwn(initial.data[0], 'secret'));
                            assert((await rows.first().textContent()).includes('Nested guest'));
                        } else if (polling) {
                            assert.equal(initial.metadata.channel, null);
                            const count = reads.length;
                            const next = page.waitForResponse(
                                async (received) =>
                                    new URL(received.url()).pathname ===
                                        `/dapter/data/Dapter.${scenario}` &&
                                    received.status() === 200 &&
                                    (await received.json()).data[0]?.name === 'Changed notebook 2',
                            );
                            await scope
                                .getByRole('button', { name: 'Change fixture only', exact: true })
                                .click();
                            assert.equal((await next).status(), 200);
                            await rows.first().filter({ hasText: 'Changed notebook 2' }).waitFor();
                            assert(reads.length >= count + 1);
                            if (scenario === 'LivePolling') {
                                await page.route(
                                    '**/dapter/data/Dapter.LivePolling',
                                    (route) => route.abort('failed'),
                                    { times: 1 },
                                );
                                await scope.locator('[data-live-http-error]').waitFor();
                                const paused = reads.length;
                                await page.waitForTimeout(1650);
                                assert.equal(
                                    reads.length,
                                    paused,
                                    'A failed polling read pauses future timers.',
                                );
                                const resumed = page.waitForResponse(
                                    (received) =>
                                        new URL(received.url()).pathname ===
                                            '/dapter/data/Dapter.LivePolling' &&
                                        received.status() === 200,
                                );
                                await scope
                                    .getByRole('button', { name: 'Restart polling', exact: true })
                                    .click();
                                assert.equal(
                                    reads.length,
                                    paused,
                                    'Restart schedules a future interval without immediate HTTP.',
                                );
                                await resumed;
                                await scope
                                    .locator('[data-live-http-error]')
                                    .waitFor({ state: 'detached' });
                                await rows
                                    .first()
                                    .filter({ hasText: 'Changed notebook 2' })
                                    .waitFor();
                            }
                        } else {
                            const descriptor = initial.metadata.channel;
                            {
                                const transportChannel =
                                    descriptor.type === 'private'
                                        ? `private-${descriptor.name}`
                                        : descriptor.name;
                                const deadline = Date.now() + 15000;
                                while (
                                    !frames.some(
                                        (frame) =>
                                            frame.event ===
                                                'pusher_internal:subscription_succeeded' &&
                                            frame.channel === transportChannel,
                                    )
                                ) {
                                    assert(
                                        Date.now() < deadline,
                                        'The actual private Dapter subscription must succeed.',
                                    );
                                    await page.waitForTimeout(100);
                                }
                                if (descriptor.type === 'private')
                                    assert(
                                        authorizations.some(
                                            (item) =>
                                                item.status === 200 &&
                                                decodeURIComponent(item.body).includes(
                                                    descriptor.name,
                                                ),
                                        ),
                                    );
                            }
                            const metadata = await scope
                                .locator('[data-live-metadata]')
                                .textContent();
                            const positions = await rows.allTextContents();
                            const readCount = reads.length;
                            const eventCount = frames.length;
                            await scope
                                .getByRole('button', {
                                    name: 'Publish one replacement',
                                    exact: true,
                                })
                                .click();
                            const deadline = Date.now() + 30000;
                            let delivered;
                            while (!delivered) {
                                delivered = frames
                                    .slice(eventCount)
                                    .find(
                                        (frame) =>
                                            frame.event === 'dapter.updated' &&
                                            frame.data?.source === `Dapter.${scenario}`,
                                    )?.data;
                                assert(
                                    Date.now() < deadline,
                                    'The queued backend update must reach the actual Echo socket.',
                                );
                                if (!delivered) await page.waitForTimeout(100);
                            }
                            assert.deepEqual(Object.keys(delivered).sort(), [
                                'channel',
                                'data',
                                'eventId',
                                'records',
                                'source',
                                'version',
                            ]);
                            assert.deepEqual(delivered.channel, descriptor);
                            assert.equal(delivered.data.length, 1);
                            assert.equal(delivered.records.rows.length, 1);
                            assert(!Object.hasOwn(delivered.data[0], 'id'));
                            assert(!Object.hasOwn(delivered.data[0], 'secret'));
                            if (scenario !== 'LivePublic') {
                                await rows
                                    .first()
                                    .filter({ hasText: 'Changed notebook 2' })
                                    .waitFor();
                                assert(
                                    (await rows.first().textContent()).includes(
                                        'Nested Fictional reader',
                                    ),
                                );
                                assert.equal((await rows.allTextContents())[1], positions[1]);
                            }
                            assert.equal(
                                await scope.locator('[data-live-metadata]').textContent(),
                                metadata,
                            );
                            assert.equal(
                                reads.length,
                                readCount,
                                'A replacement must not reload the listing.',
                            );
                            if (scenario === 'LiveIdentity' || scenario === 'LiveArrival') {
                                const earlierCount = frames.length;
                                await scope
                                    .getByRole('button', {
                                        name: 'Publish older revision',
                                        exact: true,
                                    })
                                    .click();
                                const deadline = Date.now() + 30000;
                                while (
                                    !frames
                                        .slice(earlierCount)
                                        .some(
                                            (frame) =>
                                                frame.event === 'dapter.updated' &&
                                                frame.data?.source === `Dapter.${scenario}`,
                                        )
                                ) {
                                    assert(
                                        Date.now() < deadline,
                                        'The older actual backend event must arrive.',
                                    );
                                    await page.waitForTimeout(100);
                                }
                                await rows
                                    .first()
                                    .filter({
                                        hasText:
                                            scenario === 'LiveIdentity'
                                                ? 'Changed notebook 2'
                                                : 'Changed notebook 1',
                                    })
                                    .waitFor();
                                assert.equal(reads.length, readCount);
                            }
                        }
                        await scope.screenshot({
                            path: resolve(artifacts, `${scenario}-${width}-${theme}.png`),
                        });
                        if (scenario === 'LivePrivate') {
                            const denied = page.waitForResponse(
                                (received) =>
                                    new URL(received.url()).pathname ===
                                        '/dapter/data/Dapter.LivePrivate' &&
                                    received.status() === 401,
                            );
                            await scope
                                .getByRole('button', {
                                    name: 'Revoke fictional access',
                                    exact: true,
                                })
                                .click();
                            await denied;
                            await scope.locator('[data-live-http-error]').waitFor();
                            assert.equal(
                                await rows.count(),
                                0,
                                'Context reset clears revoked protected rows.',
                            );
                            await scope.screenshot({
                                path: resolve(artifacts, `revoked-${width}-${theme}.png`),
                            });
                        }
                        assert.equal(
                            await page.evaluate(
                                () => document.documentElement.scrollWidth > window.innerWidth + 1,
                            ),
                            false,
                        );
                        await scope
                            .getByRole('button', { name: 'Reset example', exact: true })
                            .click();
                        await scope
                            .getByText(
                                resource
                                    ? 'Ready. Start example to project one fictional notebook.'
                                    : 'Ready. Start example to create an isolated fictional reader.',
                                { exact: true },
                            )
                            .waitFor();
                        summary.push({
                            scenario,
                            width,
                            theme,
                            initialVersion: initial.version,
                            actualEcho: !resource && !polling,
                        });
                    }
                }
                assert.deepEqual(errors, []);
            } finally {
                await context.close();
            }
        }
    await writeFile(resolve(artifacts, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
    console.log(
        `Verified ${summary.length} focused Resource/live/polling views with actual application transport.`,
    );
} finally {
    await browser.close();
}

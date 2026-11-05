// @vitest-environment node
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { afterAll, beforeAll, expect, test } from 'vite-plus/test';
import { buildIcons } from './build-icons.mjs';

const sourceDirectory = fileURLToPath(
    new URL('../public/images/brand', import.meta.url),
);
let outputDirectory;

beforeAll(async () => {
    outputDirectory = await mkdtemp(resolve(tmpdir(), 'artisan-docs-icons-'));
    await buildIcons({ sourceDirectory, outputDirectory });
});

afterAll(async () => {
    await rm(outputDirectory, { recursive: true, force: true });
});

test.each([
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['favicon-48x48.png', 48],
    ['favicon-96x96.png', 96],
    ['apple-touch-icon.png', 180],
    ['icon-192x192.png', 192],
    ['icon-512x512.png', 512],
    ['icon-maskable-512x512.png', 512],
])('generates %s as a square image of %i pixels', async (file, size) => {
    const metadata = await sharp(resolve(outputDirectory, file)).metadata();
    expect(metadata).toMatchObject({
        width: size,
        height: size,
        format: 'png',
    });
});

test('includes decodable 16, 32, and 48 pixel images in the ICO', async () => {
    const ico = await readFile(resolve(outputDirectory, 'favicon.ico'));
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(3);

    for (const [index, size] of [16, 32, 48].entries()) {
        const entry = 6 + index * 16;
        const length = ico.readUInt32LE(entry + 8);
        const offset = ico.readUInt32LE(entry + 12);
        const metadata = await sharp(
            ico.subarray(offset, offset + length),
        ).metadata();
        expect(metadata).toMatchObject({ width: size, height: size });
    }
});

test('gives maskable and Apple icons opaque backgrounds and a 1200 by 630 share image', async () => {
    for (const file of ['apple-touch-icon.png', 'icon-maskable-512x512.png']) {
        const metadata = await sharp(resolve(outputDirectory, file)).metadata();
        expect(metadata.hasAlpha).toBe(false);
    }

    const social = await sharp(
        resolve(outputDirectory, 'social-card.png'),
    ).metadata();
    expect(social).toMatchObject({ width: 1200, height: 630 });
});

test('references existing icons with distinct any and maskable purposes', async () => {
    const manifest = JSON.parse(
        await readFile(resolve(outputDirectory, 'site.webmanifest'), 'utf8'),
    );
    expect(manifest).toMatchObject({
        name: 'Artisan Toolbox',
        lang: 'en',
        start_url: '/docs',
    });
    expect(manifest.icons.map((icon) => icon.purpose)).toEqual([
        'any',
        'any',
        'maskable',
    ]);

    for (const icon of manifest.icons) {
        const metadata = await sharp(
            resolve(outputDirectory, icon.src.replace('/favicons/', '')),
        ).metadata();
        expect(`${metadata.width}x${metadata.height}`).toBe(icon.sizes);
    }
});

test('regenerates byte-identical files from unchanged source artwork', async () => {
    const files = (await readdir(outputDirectory)).sort();
    const before = await Promise.all(
        files.map((file) => readFile(resolve(outputDirectory, file))),
    );

    await buildIcons({ sourceDirectory, outputDirectory });

    expect((await readdir(outputDirectory)).sort()).toEqual(files);
    const after = await Promise.all(
        files.map((file) => readFile(resolve(outputDirectory, file))),
    );
    expect(after).toEqual(before);
});

test('keeps the published icons, manifest, and share image synchronized with the source artwork', async () => {
    const publicDirectory = fileURLToPath(
        new URL('../public', import.meta.url),
    );

    for (const file of await readdir(outputDirectory)) {
        const published =
            file === 'social-card.png'
                ? resolve(publicDirectory, 'images/brand', file)
                : resolve(publicDirectory, 'favicons', file);

        expect(await readFile(published)).toEqual(
            await readFile(resolve(outputDirectory, file)),
        );
    }
});

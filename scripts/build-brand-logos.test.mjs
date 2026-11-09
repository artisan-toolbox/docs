// @vitest-environment node
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { afterAll, beforeAll, expect, test } from 'vite-plus/test';
import { buildBrandLogos } from './build-brand-logos.mjs';

const sourceDirectory = fileURLToPath(new URL('../public/images/brand', import.meta.url));
const publishedDirectory = fileURLToPath(new URL('../resources/js/assets/brand', import.meta.url));
let outputDirectory;

async function fileDigest(file) {
    return createHash('sha256')
        .update(await readFile(file))
        .digest('hex');
}

beforeAll(async () => {
    outputDirectory = await mkdtemp(resolve(tmpdir(), 'artisan-docs-logos-'));
    await buildBrandLogos({ sourceDirectory, outputDirectory });
});

afterAll(async () => {
    await rm(outputDirectory, { recursive: true, force: true });
});

test.each(['light', 'dark'])(
    'generates transparent responsive %s logos smaller than their source',
    async (theme) => {
        const source = await readFile(
            resolve(sourceDirectory, `artisan-toolbox-logo-${theme}.png`),
        );
        const original = await sharp(source).metadata();

        for (const width of [192, 384, 576]) {
            const file = await readFile(
                resolve(outputDirectory, `artisan-toolbox-logo-${theme}-${width}.webp`),
            );
            const metadata = await sharp(file).metadata();
            expect(metadata).toMatchObject({
                format: 'webp',
                width,
                height: Math.round((width * original.height) / original.width),
                hasAlpha: true,
            });
            expect(file.length).toBeLessThan(source.length);
        }
    },
);

test('keeps generated frontend assets synchronized with the approved artwork', async () => {
    for (const file of await readdir(outputDirectory)) {
        expect(await fileDigest(resolve(publishedDirectory, file)), file).toBe(
            await fileDigest(resolve(outputDirectory, file)),
        );
    }
});

test('regenerates byte-identical assets without changing their module contract', async () => {
    const files = (await readdir(outputDirectory)).sort();
    const before = await Promise.all(
        files.map((file) => fileDigest(resolve(outputDirectory, file))),
    );

    await buildBrandLogos({ sourceDirectory, outputDirectory });

    expect((await readdir(outputDirectory)).sort()).toEqual(files);
    expect(
        await Promise.all(files.map((file) => fileDigest(resolve(outputDirectory, file)))),
    ).toEqual(before);
});

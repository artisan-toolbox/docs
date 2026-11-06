// @vitest-environment node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { describe, expect, it } from 'vite-plus/test';

const folder = new URL(
    '../documentation/assets/fontawesome/packages/',
    import.meta.url,
);
const sources = JSON.parse(
    await readFile(new URL('sources.json', folder), 'utf8'),
);
const digest = (value) => createHash('sha256').update(value).digest('hex');
const alpha = (pixels) =>
    Buffer.from(pixels.filter((_, index) => index % 4 === 3));

async function raster(svg, height) {
    return sharp(Buffer.from(svg))
        .resize({ height })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
}

it('includes exactly the six package marks', () => {
    expect(sources.map(({ id }) => id)).toEqual([
        'core',
        'maintainer',
        'mosaicast',
        'qztray',
        'dump-to-console',
        'front-awesome',
    ]);
});

for (const source of sources) {
    describe(source.id, () => {
        it('tracks the reviewed package artwork and upload artifact', async () => {
            const original = await readFile(
                new URL(`../${source.source}`, import.meta.url),
            );
            const artifact = await readFile(
                new URL(`${source.id}.svg`, folder),
            );
            expect(digest(original)).toBe(source.sourceSha256);
            expect(digest(artifact)).toBe(source.artifactSha256);
        });

        it('uses one black path in a numeric 512-high viewBox without unsupported SVG features', async () => {
            const svg = await readFile(
                new URL(`${source.id}.svg`, folder),
                'utf8',
            );
            expect(svg).toMatch(
                /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox="0 0 \d+ 512"><path fill="#000000" d="[MLQCZ\d.\s-]+"\/><\/svg>\n$/,
            );
            const coordinates = svg
                .match(/d="([^"]+)"/)[1]
                .match(/-?\d+(?:\.\d+)?/g)
                .map(Number);
            expect(coordinates.every(Number.isFinite)).toBe(true);
        });

        it('preserves holes with the default nonzero fill rule', async () => {
            const svg = await readFile(
                new URL(`${source.id}.svg`, folder),
                'utf8',
            );
            const standard = await raster(svg, 128);
            const evenOdd = await raster(
                svg.replace('<path ', '<path fill-rule="evenodd" '),
                128,
            );
            expect(standard.data).toEqual(evenOdd.data);
        });

        it.each([16, 24])(
            'renders a visible transparent monochrome glyph at %i px in both palettes',
            async (height) => {
                const svg = await readFile(
                    new URL(`${source.id}.svg`, folder),
                    'utf8',
                );
                const black = await raster(svg, height);
                const white = await raster(
                    svg.replace('#000000', '#ffffff'),
                    height,
                );
                const opacity = alpha(black.data);
                expect(alpha(white.data)).toEqual(opacity);
                const visible = opacity.filter((value) => value > 127).length;
                expect(visible / opacity.length).toBeGreaterThan(0.05);
                expect(visible / opacity.length).toBeLessThan(0.85);
                expect(opacity).toContain(0);
                expect(opacity).toContain(255);
            },
        );
    });
}

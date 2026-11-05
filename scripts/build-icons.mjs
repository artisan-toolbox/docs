import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const variants = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'favicon-48x48.png', size: 48 },
    { file: 'favicon-96x96.png', size: 96 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-192x192.png', size: 192 },
    { file: 'icon-512x512.png', size: 512 },
];

export async function buildIcons({
    sourceDirectory,
    outputDirectory,
    socialDirectory = outputDirectory,
}) {
    await mkdir(outputDirectory, { recursive: true });
    await mkdir(socialDirectory, { recursive: true });
    const icon = resolve(sourceDirectory, 'artisan-toolbox-icon.png');
    const images = new Map();

    for (const { file, size } of variants) {
        let image = sharp(icon).resize(size, size, { fit: 'contain' });

        if (file === 'apple-touch-icon.png') {
            image = image.flatten({ background: '#0f172a' });
        }

        const buffer = await image.png().toBuffer();
        await writeFile(resolve(outputDirectory, file), buffer);
        images.set(size, buffer);
    }

    const sizes = [16, 32, 48];
    const header = Buffer.alloc(6 + sizes.length * 16);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(sizes.length, 4);
    let offset = header.length;
    const entries = [];

    for (const [index, size] of sizes.entries()) {
        const image = images.get(size);
        const entry = 6 + index * 16;
        header.writeUInt8(size, entry);
        header.writeUInt8(size, entry + 1);
        header.writeUInt16LE(1, entry + 4);
        header.writeUInt16LE(32, entry + 6);
        header.writeUInt32LE(image.length, entry + 8);
        header.writeUInt32LE(offset, entry + 12);
        entries.push(image);
        offset += image.length;
    }

    await writeFile(
        resolve(outputDirectory, 'favicon.ico'),
        Buffer.concat([header, ...entries]),
    );

    await sharp(icon)
        .resize(384, 384)
        .extend({
            top: 64,
            bottom: 64,
            left: 64,
            right: 64,
            background: '#0f172a',
        })
        .flatten({ background: '#0f172a' })
        .png()
        .toFile(resolve(outputDirectory, 'icon-maskable-512x512.png'));

    const { data: wordmark, info } = await sharp(
        resolve(sourceDirectory, 'artisan-toolbox-logo-dark.png'),
    )
        .resize({ width: 1000 })
        .png()
        .toBuffer({ resolveWithObject: true });

    await sharp(wordmark)
        .flatten({ background: '#0f172a' })
        .extend({
            top: Math.ceil((630 - info.height) / 2),
            bottom: Math.floor((630 - info.height) / 2),
            left: Math.ceil((1200 - info.width) / 2),
            right: Math.floor((1200 - info.width) / 2),
            background: '#0f172a',
        })
        .ensureAlpha()
        .png()
        .toFile(resolve(socialDirectory, 'social-card.png'));

    const manifest = {
        id: '/',
        name: 'Artisan Toolbox',
        short_name: 'Artisan Toolbox',
        description: 'Documentation for Artisan Toolbox Laravel packages.',
        lang: 'en',
        start_url: '/docs',
        scope: '/',
        display: 'browser',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
            {
                src: '/favicons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/favicons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/favicons/icon-maskable-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    };

    await writeFile(
        resolve(outputDirectory, 'site.webmanifest'),
        `${JSON.stringify(manifest, null, 4)}\n`,
    );
}

if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
    const publicDirectory = fileURLToPath(
        new URL('../public', import.meta.url),
    );
    await buildIcons({
        sourceDirectory: resolve(publicDirectory, 'images/brand'),
        outputDirectory: resolve(publicDirectory, 'favicons'),
        socialDirectory: resolve(publicDirectory, 'images/brand'),
    });
}

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const themes = ['light', 'dark'];
const widths = [192, 384, 576];

export async function buildBrandLogos({ sourceDirectory, outputDirectory }) {
    await mkdir(outputDirectory, { recursive: true });
    const imports = [];
    const variants = [];

    for (const theme of themes) {
        const source = resolve(sourceDirectory, `artisan-toolbox-logo-${theme}.png`);
        const { width, height } = await sharp(source).metadata();

        for (const size of widths) {
            const file = `artisan-toolbox-logo-${theme}-${size}.webp`;
            await sharp(source)
                .resize({ width: size })
                .webp({ quality: 85, alphaQuality: 100, effort: 4 })
                .toFile(resolve(outputDirectory, file));
            imports.push(`import ${theme}${size} from './${file}?no-inline';`);
        }

        variants.push(
            `    ${theme}: {\n` +
                `        src: ${theme}${widths[0]},\n` +
                `        srcset: \`${widths.map((size) => `\${${theme}${size}} ${size}w`).join(', ')}\`,\n` +
                `        width: ${width},\n` +
                `        height: ${height},\n` +
                `    },`,
        );
    }

    await writeFile(
        resolve(outputDirectory, 'brandLogos.js'),
        `${imports.join('\n')}\n\nexport const brandLogos = {\n${variants.join('\n')}\n};\n`,
    );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    await buildBrandLogos({
        sourceDirectory: fileURLToPath(new URL('../public/images/brand', import.meta.url)),
        outputDirectory: fileURLToPath(new URL('../resources/js/assets/brand', import.meta.url)),
    });
}

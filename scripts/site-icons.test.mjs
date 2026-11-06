// @vitest-environment node
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';

const root = fileURLToPath(new URL('../resources/js/', import.meta.url));

async function sources(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const path = join(directory, entry.name);
            if (entry.isDirectory()) return sources(path);
            return /\.(vue|ts|js)$/.test(entry.name) ? [path] : [];
        }),
    );
    return files.flat();
}

describe('application icon ownership', () => {
    it('keeps utility and brand icons on Font Awesome through SiteIcon', async () => {
        const violations = [];
        for (const path of await sources(root)) {
            const source = await readFile(path, 'utf8');
            if (/@lucide\/vue/.test(source))
                violations.push(relative(root, path));
            if (
                /<svg\s/.test(source) &&
                !path.endsWith('/PlaceholderPattern.vue')
            ) {
                violations.push(relative(root, path));
            }
        }
        expect(violations).toEqual([]);
    });
});

// @vitest-environment node
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { parse } from '@vue/compiler-sfc';

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

function hasInlineSvg(source, path) {
    const markup = path.endsWith('.vue')
        ? (parse(source).descriptor.template?.content ?? '')
        : source;
    return /<svg\s/.test(markup);
}

describe('application icon ownership', () => {
    it('distinguishes rendered SVGs from static documentation source examples', () => {
        const example =
            '<script setup>const code = `<svg viewBox="0 0 16 16"></svg>`;<' +
            '/script><template><CodeExample :code="code" /></template>';
        const inlineSvg = '<template><svg viewBox="0 0 16 16"></svg></template>';

        expect(hasInlineSvg(example, 'Guide.vue')).toBe(false);
        expect(hasInlineSvg(inlineSvg, 'Control.vue')).toBe(true);
        expect(hasInlineSvg('<svg viewBox="0 0 16 16">', 'control.js')).toBe(true);
    });
    it('keeps utility and brand icons on Font Awesome through SiteIcon', async () => {
        const violations = [];
        for (const path of await sources(root)) {
            const source = await readFile(path, 'utf8');
            if (/@lucide\/vue/.test(source)) violations.push(relative(root, path));
            if (hasInlineSvg(source, path) && !path.endsWith('/PlaceholderPattern.vue')) {
                violations.push(relative(root, path));
            }
        }
        expect(violations).toEqual([]);
    });
});

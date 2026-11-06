import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse, compileScript } from '@vue/compiler-sfc';
import { describe, expect, it } from 'vite-plus/test';
import foundations from '../resources/js/components/docs/foundations-source-fixtures.json';
import frontAwesome from '../resources/js/components/docs/front-awesome/legacy-parity.json';
import qztray from '../resources/js/components/docs/qztray/legacy-parity.json';
import community from '../resources/js/components/docs/fixtures/community-pages.json';

describe('Legacy documentation fixture integrity in the workspace', () => {
    for (const fixture of [
        ...foundations,
        ...frontAwesome,
        ...qztray,
        {
            slug: 'mosaicast/installation',
            legacyPath: 'packages/mosaicast/installation',
            sourceSha256:
                'dbc08e88b8a774630b2e8367b0647eb1638c998db86b61fb5412f3e3aca7be9d',
        },
        ...community.filter(
            (page) => page.slug === 'project/documentation-policy',
        ),
    ]) {
        it(`matches the frozen ${fixture.slug} fixture to its legacy source`, () => {
            const source = readFileSync(
                new URL(
                    `../../docs_old/src/content/docs/${fixture.legacyPath}.md`,
                    import.meta.url,
                ),
            );

            expect(createHash('sha256').update(source).digest('hex')).toBe(
                fixture.sourceSha256 ?? fixture.sha256,
            );
        });
    }
});

const converter = path.resolve('scripts/migrate-legacy-documentation.mjs');
function convert(legacyPath) {
    return execFileSync(process.execPath, [converter, legacyPath], {
        encoding: 'utf8',
    });
}

describe('Offline legacy documentation conversion', () => {
    it('prints editable semantic Vue with copyable examples, table headings, and reactive route links', () => {
        const source = convert('packages/core/conditional-arrays');
        expect(source).toContain('<DocsTable caption=');
        expect(source).toContain('<th scope="col">');
        expect(source).toContain('<CodeExample ');
        expect(source).not.toContain('v-html');
        const { descriptor, errors } = parse(source);
        expect(errors).toEqual([]);
        expect(() =>
            compileScript(descriptor, { id: 'converted-core' }),
        ).not.toThrow();
        expect(convert('packages/mosaicast/index')).toContain(
            "findNavigationItem(navigation, 'mosaicast/vue-plugin').href",
        );
    });

    it('preserves code containing Vue script end tags as valid setup source', () => {
        const source = convert('packages/qztray/index');
        expect(source).toContain('\\x3C/script');
        const directory = mkdtempSync(path.join(tmpdir(), 'docs-conversion-'));
        try {
            const filename = path.join(directory, 'Converted.vue');
            writeFileSync(filename, source);
            execFileSync(path.resolve('node_modules/.bin/vp'), [
                'fmt',
                filename,
            ]);
            execFileSync(path.resolve('node_modules/.bin/vp'), [
                'lint',
                '--fix',
                filename,
            ]);
            const formatted = readFileSync(filename, 'utf8');
            const { descriptor, errors } = parse(formatted);
            expect(errors).toEqual([]);
            expect(() =>
                compileScript(descriptor, { id: 'converted-qztray' }),
            ).not.toThrow();
            const examples = [
                ...formatted.matchAll(
                    /const example\d+ =\s*(`(?:\\[\s\S]|[^`])*`);/g,
                ),
            ].map((match) =>
                match[1]
                    .slice(1, -1)
                    .replace(/\\(x3C|[\s\S])/g, (_, escaped) =>
                        escaped === 'x3C' ? '<' : escaped,
                    ),
            );
            const markdown = readFileSync(
                path.resolve(
                    '../docs_old/src/content/docs/packages/qztray/index.md',
                ),
                'utf8',
            );
            const originalExamples = [
                ...markdown.matchAll(/^```[^\n]*\n([\s\S]*?)\n```/gm),
            ].map((match) => match[1]);
            expect(examples).toEqual(originalExamples);
        } finally {
            rmSync(directory, { recursive: true, force: true });
        }
    });

    it('preserves static warning directives and explicit legacy aliases', () => {
        const source = convert('packages/front-awesome/index');
        expect(source).toContain('<DocsCallout variant=');
        expect(source).toContain('id="frontend-distribution"');
        expect(source).toContain(
            '<template #title>Work in progress (WIP)</template>',
        );
    });
});

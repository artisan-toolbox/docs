import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { extractDocumentation } from './documentation-search.mjs';

const temporaryRoots = [];
afterEach(() => {
    for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(files) {
    const root = mkdtempSync(resolve(tmpdir(), 'atb-search-content-'));
    temporaryRoots.push(root);
    function write(path, content) {
        const file = resolve(root, 'resources/js', path);
        mkdirSync(resolve(file, '..'), { recursive: true });
        writeFileSync(file, content);
    }
    for (const [path, content] of Object.entries(files)) write(path, content);
    const page = {
        slug: 'fixture',
        title: 'Fixture package',
        description: 'Learn the package.',
        sourcePath: 'resources/js/pages/docs/Fixture.vue',
        packageTitle: 'Fixture',
        requirements: ['PHP 8.5'],
    };
    return {
        root,
        page,
        write,
        extract: (pages = [page]) => extractDocumentation(pages, { root }),
    };
}

describe('documentation content extraction', () => {
    it('indexes nested authored prose, static props, code and table rows without executing setup or navigation helpers', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>
import Content from '../../components/docs/Content.vue';
throw new Error('Setup must never execute');
</script><template><Content :requirements="page.requirements" /></template>`,
            'components/docs/Content.vue': `<script setup>
import Child from './Child.vue';
defineProps({ requirements: Array });
</script><template><p>Introductory guide text.</p><Child :items="requirements" /></template>`,
            'components/docs/Child.vue': [
                '<script setup>',
                "import Section from '@/components/docs/ProseSection.vue';",
                "import Requirements from '@/components/docs/Requirements.vue';",
                "import Example from '@/components/docs/CodeExample.vue';",
                "import Table from '@/components/docs/DocsTable.vue';",
                "import Link from '@/components/docs/DocsLink.vue';",
                'const props = defineProps({items:Array});',
                'const code = String.raw`use ArtisanToolbox\\Core\\Sift;`;',
                "const columns=['Tool','Configuration'];",
                "const rows=[['PHPStan','phpstan.dist.neon']];",
                '</script><template>',
                '<Requirements :items="props.items" />',
                '<Section id="first-example" title="First example">',
                '<p>Build a <code>conditional</code> array.</p>',
                '<Link :href="findNavigationItem(navigation,\'core\').href">Core guide</Link>',
                '<Example label="Import the helper" :code="code" />',
                '<Table caption="Tools" :columns="columns" :rows="rows">',
                '<template #cell="{value}">{{value.split(",")}}</template>',
                '</Table></Section>',
                '<h3 id="details">Practical <code>details</code></h3><p>Finish here.</p>',
                '</template>',
            ].join('\n'),
        });
        const result = setup.extract();

        expect(result.map(({ anchor }) => anchor)).toEqual([
            null,
            'requirements',
            'first-example',
            'details',
        ]);
        expect(result[0].body).toBe('Learn the package. Introductory guide text.');
        expect(result[1].body).toBe('PHP 8.5');
        expect(result[2]).toMatchObject({
            heading: 'First example',
            body: 'Build a conditional array. Core guide Import the helper use ArtisanToolbox\\Core\\Sift; Tools Tool Configuration PHPStan phpstan.dist.neon',
        });
        expect(result[3]).toMatchObject({
            heading: 'Practical details',
            body: 'Finish here.',
        });
    });

    it('indexes the same installed command through nested props and slots after a dependency refresh', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Content from '../../components/docs/Content.vue';</script><template><Content :page="page"><p>Keep Composer before npm.</p></Content></template>`,
            'components/docs/Content.vue': `<script setup>import Command from './InstallCommand.vue'; const props = defineProps({page:Object});</script><template><Command :package="props.page.package" command="composer" label="Install locked dependency"><slot /></Command></template>`,
        });
        const first = 'composer require artisan-toolbox/core:1.x-dev';
        setup.page.package = {
            installationCommands: { composer: { code: first } },
        };
        expect(setup.extract()[0].body).toBe(
            `Learn the package. Install locked dependency ${first} Keep Composer before npm.`,
        );
        const next = 'composer require artisan-toolbox/core:v1.8.7';
        setup.page.package.installationCommands.composer = {
            code: next,
        };
        expect(setup.extract()[0].body).toBe(
            `Learn the package. Install locked dependency ${next} Keep Composer before npm.`,
        );
        expect(setup.extract()[0].body).not.toContain(first);
    });

    it('indexes only the visible unavailable state when an installation command has no locked dependency', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Command from '../../components/docs/InstallCommand.vue';</script><template><Command :package="page.package" label="Hidden install label"><p>Hidden installation explanation.</p></Command></template>`,
        });
        setup.page.package = {
            installationCommands: { composer: { code: null } },
        };
        expect(setup.extract()[0].body).toBe(
            'Learn the package. Installation command unavailable. The documentation has no locked version for a required dependency.',
        );
    });

    it('follows shared partial edits and newly registered pages and removes unregistered pages', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue':
                '<script setup>import Body from "../../components/docs/Body.vue";</script><template><Body /></template>',
            'components/docs/Body.vue': '<template><p>Original text.</p></template>',
            'pages/docs/Unregistered.vue':
                '<template><p>Unregistered secret fixture.</p></template>',
        });
        const second = { ...setup.page, slug: 'second', title: 'Second guide' };
        expect(setup.extract()).toHaveLength(1);
        setup.write('components/docs/Body.vue', '<template><p>Updated shared text.</p></template>');
        const updated = setup.extract([setup.page, second]);
        expect(updated).toHaveLength(2);
        expect(updated.every((document) => document.body.includes('Updated shared text.'))).toBe(
            true,
        );
        expect(JSON.stringify(updated)).not.toContain('Unregistered secret fixture');
        expect(setup.extract([second]).map(({ slug }) => slug)).toEqual(['second']);
        expect(setup.extract([second])).toEqual(setup.extract([second]));
    });

    it('skips decorative icons, demo imports and excluded runtime output without loading them', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Demo from '@/components/demo/package/Runtime.vue'; import Glyph from '@/components/site/SiteIcon.vue';</script>
<template><p>Authored explanation.</p><Glyph name="book-open" /><Demo /><div data-docs-outline-exclude>{{fetch('/private')}}</div><p data-search-exclude>Excluded fixture.</p></template>`,
        });
        expect(setup.extract()[0].body).toBe('Learn the package. Authored explanation.');
    });

    it('preserves ordinary template literal escapes in code examples', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': [
                '<script setup>',
                "import CodeExample from '@/components/docs/CodeExample.vue';",
                'const namespace = "ArtisanToolbox";',
                'const code = `use ${namespace}\\\\Core\\\\Sift;`;',
                '</script><template><CodeExample label="Example" :code="code" /></template>',
            ].join('\n'),
        });
        expect(setup.extract()[0].body).toBe(
            'Learn the package. Example use ArtisanToolbox\\Core\\Sift;',
        );
    });

    it('indexes caller-owned slots, fallback slots, static kebab props, and code notes', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Partial from '../../components/docs/Partial.vue'; import CodeExample from '@/components/docs/CodeExample.vue';</script>
<template><Partial body-text="Visible static prop"><p>Caller prose.</p><template #aside><p>Named caller note.</p></template></Partial><CodeExample label="Example" code="echo yes"><p>Visible code note.</p></CodeExample></template>`,
            'components/docs/Partial.vue': `<script setup>defineProps({bodyText:String});</script><template><p>{{bodyText}}</p><slot /><slot name="aside" /><slot name="absent"><p>Fallback note.</p></slot></template>`,
        });
        expect(setup.extract()[0].body).toBe(
            'Learn the package. Visible static prop Caller prose. Named caller note. Fallback note. Example echo yes Visible code note.',
        );
    });

    it('rejects runtime scoped slot content instead of omitting it', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Partial from '../../components/docs/Partial.vue';</script><template><Partial v-slot="{value}"><p>{{value}}</p></Partial></template>`,
            'components/docs/Partial.vue': '<template><slot value="example" /></template>',
        });
        expect(() => setup.extract()).toThrow('must not depend on runtime slot props');
    });

    it.each([
        ['a visible function call', '<p>{{fetch("/private")}}</p>', 'unsupported CallExpression'],
        ['a runtime prose branch', '<p v-if="enabled">Conditional text.</p>', 'runtime directives'],
        ['raw HTML', '<div v-html="body" />', 'runtime directives'],
        ['dynamic text content', '<p v-text="fetch(\'/private\')" />', 'runtime directives'],
        ['conditionally hidden prose', '<p v-show="false">Hidden text</p>', 'runtime directives'],
        [
            'runtime content inside a heading',
            '<h2 id="title">Title <span v-text="fetch(\'/private\')" /></h2>',
            'runtime directives',
        ],
        [
            'conditional content inside a heading',
            '<h2 id="title">Title <span v-if="enabled">Conditional</span></h2>',
            'runtime directives',
        ],
        [
            'an unknown heading component',
            '<h2 id="title">Title <UnknownContent /></h2>',
            'Unsupported searchable heading component',
        ],
        [
            'a missing visible binding',
            '<p>{{missing}}</p>',
            'Unresolved searchable binding missing',
        ],
        [
            'duplicate section IDs',
            '<h2 id="same">First</h2><h2 id="same">Second</h2>',
            'Duplicate search anchor same',
        ],
        [
            'an unknown component',
            '<RemoteContent />',
            'Unsupported searchable component RemoteContent',
        ],
    ])('fails clearly instead of silently omitting %s', (_, content, error) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<template>${content}</template>`,
        });
        expect(() => setup.extract()).toThrow(error);
        expect(() => setup.extract()).toThrow('pages/docs/Fixture.vue:');
    });

    it('fails on import cycles and missing registered sources', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue':
                '<script setup>import Again from "./Fixture.vue";</script><template><Again /></template>',
        });
        expect(() => setup.extract()).toThrow('Circular Vue content import');
        expect(() =>
            setup.extract([
                {
                    ...setup.page,
                    sourcePath: 'resources/js/pages/docs/Missing.vue',
                },
            ]),
        ).toThrow('ENOENT');
    });

    it('refuses source files outside the documentation JavaScript tree', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': '<template><p>Valid text.</p></template>',
        });
        writeFileSync(resolve(setup.root, 'outside.vue'), '<template><p>Outside.</p></template>');
        expect(() => setup.extract([{ ...setup.page, sourcePath: 'outside.vue' }])).toThrow(
            'inside resources/js',
        );
    });
});

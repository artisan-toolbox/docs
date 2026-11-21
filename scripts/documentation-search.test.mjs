import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, posix, win32 } from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { extractDocumentation, isInsideDirectory } from './documentation-search.mjs';

it.each([
    [posix, '/app/Demo', '/app/Demo/Resource.php', true],
    [posix, '/app/Demo', '/app/Demo/..fixture.php', true],
    [posix, '/app/Demo', '/app/DemoPrivate/Resource.php', false],
    [posix, '/app/Demo', '/app/Private.php', false],
    [win32, 'C:\\app\\Demo', 'C:\\app\\Demo\\Resource.php', true],
    [win32, 'C:\\app\\Demo', 'C:\\app\\DemoPrivate\\Resource.php', false],
    [win32, 'C:\\app\\Demo', 'D:\\Private.php', false],
    [win32, 'C:\\app\\Demo', 'C:\\app\\Private.php', false],
])(
    'confines canonical source paths on both path platforms %#',
    (platform, directory, file, accepted) => {
        expect(isInsideDirectory(directory, file, platform)).toBe(accepted);
    },
);

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

    it('indexes collapsed roadmap details at stable task destinations through an aliased import', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>
import Task from '@/components/docs/RoadmapItem.vue';
import Phase from '@/components/docs/RoadmapPhase.vue';
</script><template>
<Phase id="phase-0" title="Settle the contract">
<Task id="todo-0-1" title="Record authority"><p>Accept choices only within server declarations.</p></Task>
<Task id="todo-0-2" title="Define schema" status="completed"><template #default><p>Validate typed inputs.</p></template></Task>
<Task id="todo-0-3" title="Verify failures" status="in_progress"><p>Reject unknown fields.</p></Task>
<Task id="todo-0-4" title="Build queries" :status="'not_started'"><p>Preserve mandatory scopes.</p></Task>
</Phase>
</template>`,
        });
        const documents = setup.extract();
        expect(documents.find(({ anchor }) => anchor === 'phase-0')).toMatchObject({
            heading: 'Settle the contract',
            body: 'WIP 1 of 4 tasks completed 25%',
        });
        const tasks = documents.filter(({ anchor }) => anchor?.startsWith('todo-'));
        expect(tasks.map(({ anchor, heading, body }) => ({ anchor, heading, body }))).toEqual([
            {
                anchor: 'todo-0-1',
                heading: 'Record authority',
                body: 'Not started Accept choices only within server declarations.',
            },
            {
                anchor: 'todo-0-2',
                heading: 'Define schema',
                body: 'Completed Validate typed inputs.',
            },
            { anchor: 'todo-0-3', heading: 'Verify failures', body: 'WIP Reject unknown fields.' },
            {
                anchor: 'todo-0-4',
                heading: 'Build queries',
                body: 'Not started Preserve mandatory scopes.',
            },
        ]);
    });

    it('keeps roadmap phase prose and surrounding content at their owning destinations', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>
import Phase from '@/components/docs/RoadmapPhase.vue';
import Task from '@/components/docs/RoadmapItem.vue';
</script><template>
<h2 id="delivery">Delivery plan</h2>
<p>Start with the accepted proposal.</p>
<Phase id="phase-0" title="Settle the contract">
<p>Agree on the request contract.</p>
<ol><li><Task id="todo-0-1" title="Define the schema"><p>Validate typed inputs.</p></Task></li></ol>
<p>Exit when the contract has acceptance evidence.</p>
</Phase>
<p>Continue with the next delivery phase.</p>
<Phase id="phase-1" title="Build the backend">
<p>Implement the agreed contract.</p>
<Task id="todo-1-1" title="Build the pipeline"><p>Preserve mandatory scopes.</p></Task>
<p>Exit when the backend satisfies its contract.</p>
</Phase>
<p>Review the whole delivery plan.</p>
<h2 id="verification">Verification</h2><p>Run the acceptance suite.</p>
</template>`,
        });
        const documents = setup.extract();
        expect(documents.map(({ anchor }) => anchor)).toEqual([
            null,
            'delivery',
            'phase-0',
            'todo-0-1',
            'phase-1',
            'todo-1-1',
            'verification',
        ]);
        const section = (anchor) => documents.find((document) => document.anchor === anchor);
        expect(section('phase-0').body).toBe(
            'Not started 0 of 1 tasks completed 0% Agree on the request contract. Exit when the contract has acceptance evidence.',
        );
        expect(section('delivery').body).toBe(
            'Start with the accepted proposal. Continue with the next delivery phase. Review the whole delivery plan.',
        );
        expect(section('todo-0-1').body).toBe('Not started Validate typed inputs.');
        expect(section('phase-1').body).toBe(
            'Not started 0 of 1 tasks completed 0% Implement the agreed contract. Exit when the backend satisfies its contract.',
        );
        expect(section('todo-1-1').body).toBe('Not started Preserve mandatory scopes.');
        expect(section('verification').body).toBe('Run the acceptance suite.');
        expect(section(null).body).toBe('Learn the package.');
        for (const document of documents) {
            expect(Object.keys(document).sort()).toEqual([
                'anchor',
                'body',
                'heading',
                'packageTitle',
                'slug',
                'title',
            ]);
        }
    });

    it.each([
        ['id="todo-0-1"', 'nonempty static title'],
        ['id="todo-0-1" title=" "', 'nonempty static title'],
        ['title="Task"', 'stable lowercase ID'],
        ['id=" " title="Task"', 'stable lowercase ID'],
        ['id="Task ID" title="Task"', 'stable lowercase ID'],
        ['id="todo-0-1" title="Task" done="false"', 'uses status instead of done'],
        ['id="todo-0-1" title="Task" status="done"', 'status must be'],
        ['id="todo-0-1" title="Task" status', 'status must be'],
        ['id="todo-0-1" title="Task" status="toString"', 'status must be'],
        ['id="todo-0-1" title="Task" :status="1"', 'status must be'],
        ['id="todo-0-1" :title="fetch(\'/private\')"', 'unsupported CallExpression'],
        ['id="todo-0-1" title="Task" :status="fetch(\'/private\')"', 'unsupported CallExpression'],
        ['id="todo-0-1" :title="1"', 'nonempty static title'],
    ])('rejects invalid roadmap metadata %s', (attributes, message) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import RoadmapItem from '@/components/docs/RoadmapItem.vue';</script><template><RoadmapItem ${attributes}><p>Task detail.</p></RoadmapItem></template>`,
        });
        expect(() => setup.extract()).toThrow(message);
    });

    it.each([
        ['', 'Not started 0 of 0 tasks completed 0%'],
        ['not_started', 'Not started 0 of 1 tasks completed 0%'],
        ['in_progress', 'WIP 0 of 1 tasks completed 0%'],
        ['completed', 'Completed 1 of 1 tasks completed 100%'],
    ])('indexes phase progress for authored state %s', (status, expected) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>
import Phase from '@/components/docs/RoadmapPhase.vue';
import Task from '@/components/docs/RoadmapItem.vue';
</script><template><Phase id="phase-0" title="Settle the contract">${status ? `<ol><li><Task id="todo-0-1" title="Record authority" status="${status}"><p>Task evidence.</p></Task></li></ol>` : ''}</Phase></template>`,
        });
        expect(setup.extract().find(({ anchor }) => anchor === 'phase-0').body).toBe(expected);
    });

    it.each([
        ['id="phase-0"', '<p>Task evidence.</p>', 'nonempty static title'],
        ['title="Phase"', '<p>Task evidence.</p>', 'stable lowercase ID'],
        ['id="Phase ID" title="Phase"', '', 'stable lowercase ID'],
        ['id="phase-0" title="Phase" status="completed"', '', 'derives status'],
        [
            'id="phase-0" title="Phase"',
            '<template #default="state">{{state}}</template>',
            'authored default slot',
        ],
        [
            'id="phase-0" title="Phase"',
            '<template #summary>Other summary</template>',
            'authored default slot',
        ],
    ])('rejects invalid phase metadata or slots %s', (attributes, content, message) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Phase from '@/components/docs/RoadmapPhase.vue';</script><template><Phase ${attributes}>${content}</Phase></template>`,
        });
        expect(() => setup.extract()).toThrow(message);
    });

    it('rejects duplicate task destinations', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Task from '@/components/docs/RoadmapItem.vue';</script><template><Task id="todo-0-1" title="First" /><Task id="todo-0-1" title="Second" /></template>`,
        });
        expect(() => setup.extract()).toThrow('Duplicate search anchor todo-0-1');
    });

    it.each([
        '<template #summary>Other summary</template>',
        '<template #default="state">{{state}}</template>',
    ])('rejects unsupported roadmap slots %s', (content) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import Task from '@/components/docs/RoadmapItem.vue';</script><template><Task id="todo-0-1" title="First">${content}</Task></template>`,
        });
        expect(() => setup.extract()).toThrow('authored default slot');
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

    it('indexes static DemoFrame source labels and code without visiting its live slot', () => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>
import Preview from '@/components/demo/DemoFrame.vue';
const code = 'import { Rating } from "@artisan-toolbox/front-awesome/components/WebAwesome";';
</script><template><h2 id="rating">Rating</h2><Preview title="Runtime preview title" :sources="[{label: 'Rating source', language: 'vue', code}]"><output>{{fetch('/private')}}</output><p>Runtime-only value.</p></Preview></template>`,
        });
        const result = setup.extract();
        expect(result[1]).toMatchObject({
            anchor: 'rating',
            body: 'Rating source import { Rating } from "@artisan-toolbox/front-awesome/components/WebAwesome";',
        });
        expect(JSON.stringify(result)).not.toContain('Runtime');
        expect(JSON.stringify(result)).not.toContain('/private');
    });

    it.each([
        ['[{ label: "Source", code: fetch("/private") }]', 'unsupported CallExpression'],
        ['{ label: "Source", code: "example" }', 'sources must be a static array'],
        ['[{ label: "Source", code: 5 }]', 'need static labels and code'],
    ])('rejects invalid DemoFrame sources %s', (sources, message) => {
        const setup = fixture({
            'pages/docs/Fixture.vue': `<script setup>import DemoFrame from '@/components/demo/DemoFrame.vue';</script><template><DemoFrame :sources='${sources}' /></template>`,
        });
        expect(() => setup.extract()).toThrow(message);
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

    it('indexes the displayed PHP source without executing the imported example', () => {
        const code = '<?php throw new RuntimeException("Never execute searchable examples");';
        const setup = fixture({
            '../../app/DataSources/Quickstart.php': code,
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../../../app/DataSources/Quickstart.php?raw';</script><template><CodeExample label="Quickstart" :code="code" /></template>`,
        });
        expect(setup.extract()[0].body).toBe(`Learn the package. Quickstart ${code}`);
        setup.write('../../app/DataSources/Quickstart.php', '<?php return "Updated source";');
        expect(setup.extract()[0].body).toContain('Updated source');
    });

    it('indexes Vue demo source and rejects a demo symlink outside the examples', () => {
        const code = '<template><p>Demo source</p></template>';
        const setup = fixture({
            'components/demo/Shared.vue': code,
            'components/Private.vue': '<template><p>Private fixture</p></template>',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../components/demo/Shared.vue?raw';</script><template><CodeExample label="Demo" :code="code" /></template>`,
        });
        expect(setup.extract()[0].body).toBe(`Learn the package. Demo ${code}`);
        symlinkSync(
            resolve(setup.root, 'resources/js/components/Private.vue'),
            resolve(setup.root, 'resources/js/components/demo/Link.vue'),
        );
        setup.write(
            'pages/docs/Fixture.vue',
            `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../components/demo/Link.vue?raw';</script><template><CodeExample label="Demo" :code="code" /></template>`,
        );
        expect(() => setup.extract()).toThrow('Vue files inside resources/js/components/demo');
    });

    it('indexes the public demo helper shown by a Resource guide without executing it', () => {
        const code = '<?php throw new RuntimeException("Never execute demo helpers");';
        const setup = fixture({
            '../../app/Demo/Dapter/Resources/NotebookResource.php': code,
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../../../app/Demo/Dapter/Resources/NotebookResource.php?raw';</script><template><CodeExample label="Resource" :code="code" /></template>`,
        });
        expect(setup.extract()[0].body).toBe(`Learn the package. Resource ${code}`);
    });

    it('indexes checked Dapter TypeScript references without executing them', () => {
        const code = 'export type ProtocolVersion = 2; throw new Error("Never execute");';
        const setup = fixture({
            '../../app/DataSources/Allowed.php': '<?php return [];',
            'pages/docs/dapter/design/reference/operations.ts': code,
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from './dapter/design/reference/operations.ts?raw';</script><template><CodeExample label="Planned operations" :code="code" /></template>`,
        });
        expect(setup.extract()[0].body).toBe(`Learn the package. Planned operations ${code}`);
    });

    it.each([
        'pages/docs/dapter/design/private.ts',
        'pages/docs/dapter/design/reference/nested/private.ts',
        'pages/docs/dapter/design/reference/private.json',
    ])('rejects raw source outside the checked reference boundary %s', (path) => {
        const setup = fixture({
            '../../app/DataSources/Allowed.php': '<?php return [];',
            [path]: 'Private fixture',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../${path}?raw';</script><template><CodeExample label="Example" :code="code" /></template>`,
        });
        expect(() => setup.extract()).toThrow('Raw searchable examples must be PHP sources');
    });

    it('rejects a TypeScript reference symlink exposing other source', () => {
        const setup = fixture({
            '../../app/DataSources/Allowed.php': '<?php return [];',
            'pages/docs/dapter/design/private.ts': 'Private fixture',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from './dapter/design/reference/link.ts?raw';</script><template><CodeExample label="Example" :code="code" /></template>`,
        });
        mkdirSync(resolve(setup.root, 'resources/js/pages/docs/dapter/design/reference'));
        symlinkSync(
            resolve(setup.root, 'resources/js/pages/docs/dapter/design/private.ts'),
            resolve(setup.root, 'resources/js/pages/docs/dapter/design/reference/link.ts'),
        );
        expect(() => setup.extract()).toThrow('Raw searchable examples must be PHP sources');
    });

    it.each([
        '../../app/Private.php',
        '../../app/DataSources/Private.json',
        '../../app/Demo/Private.json',
        '../../app/DemoPrivate/Private.php',
    ])('rejects a raw searchable import outside the PHP example boundary %s', (path) => {
        const setup = fixture({
            '../../app/DataSources/Allowed.php': '<?php return [];',
            [path]: 'Private fixture',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../${path}?raw';</script><template><CodeExample label="Example" :code="code" /></template>`,
        });
        expect(() => setup.extract()).toThrow(
            'Raw searchable examples must be PHP sources inside app/DataSources or app/Demo',
        );
    });

    it('rejects a symlink that exposes PHP outside the example source directory', () => {
        const setup = fixture({
            '../../app/DataSources/Allowed.php': '<?php return [];',
            '../../app/Private.php': 'Private fixture',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../../../app/DataSources/Link.php?raw';</script><template><CodeExample label="Example" :code="code" /></template>`,
        });
        symlinkSync(
            resolve(setup.root, 'app/Private.php'),
            resolve(setup.root, 'app/DataSources/Link.php'),
        );
        expect(() => setup.extract()).toThrow(
            'Raw searchable examples must be PHP sources inside app/DataSources or app/Demo',
        );
    });

    it('rejects a demo helper symlink that exposes private PHP', () => {
        const setup = fixture({
            '../../app/Private.php': 'Private fixture',
            '../../app/Demo/Allowed.php': '<?php return [];',
            'pages/docs/Fixture.vue': `<script setup>import CodeExample from '@/components/docs/CodeExample.vue'; import code from '../../../../app/Demo/Link.php?raw';</script><template><CodeExample label="Example" :code="code" /></template>`,
        });
        symlinkSync(
            resolve(setup.root, 'app/Private.php'),
            resolve(setup.root, 'app/Demo/Link.php'),
        );
        expect(() => setup.extract()).toThrow('Raw searchable examples must be PHP sources');
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

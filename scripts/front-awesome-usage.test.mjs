import { describe, expect, it } from 'vite-plus/test';
import { inspectSource, inventorySources } from './front-awesome-usage.mjs';

describe('Front Awesome rendered usage inventory', () => {
    it('counts rendered controls and public aliases without inspecting authored source strings', () => {
        const source = `<script setup>
import { Button as ActionButton, Input, useAppearance } from '@artisan-toolbox/front-awesome';
const authored = '<button><input><wa-select></wa-select></button>';
const exampleImport = "import Example from './Never.vue'";
</script>
<template>
    <ActionButton>Run</ActionButton>
    <action-button>Again</action-button>
    <button>Native</button>
    <input />
    <select /><textarea /><details /><dialog /><progress /><meter />
    <wa-input />
    <CodeExample :code="authored" />
    <code>&lt;button&gt;Example&lt;/button&gt;</code>
</template>`;
        const result = inspectSource(source, 'Example.vue');
        expect(result.imports).toEqual(['@artisan-toolbox/front-awesome']);
        expect(result.occurrences.filter((item) => item.kind === 'front-awesome')).toEqual([
            {
                file: 'Example.vue',
                line: 7,
                tag: 'ActionButton',
                kind: 'front-awesome',
                local: 'ActionButton',
                imported: 'Button',
                source: '@artisan-toolbox/front-awesome',
            },
            {
                file: 'Example.vue',
                line: 8,
                tag: 'action-button',
                kind: 'front-awesome',
                local: 'ActionButton',
                imported: 'Button',
                source: '@artisan-toolbox/front-awesome',
            },
        ]);
        expect(
            result.occurrences.filter((item) => item.kind === 'native').map((item) => item.tag),
        ).toEqual([
            'button',
            'input',
            'select',
            'textarea',
            'details',
            'dialog',
            'progress',
            'meter',
        ]);
        expect(result.occurrences.filter((item) => item.kind === 'raw-web-awesome')).toEqual([
            { file: 'Example.vue', line: 12, tag: 'wa-input', kind: 'raw-web-awesome' },
        ]);
    });

    it('separates active imports and Inertia pages from unused starter controls and content-only imports', () => {
        const inventory = inventorySources({
            'resources/js/app.ts': `import Shell from '@/Shell.vue'; import source from './Raw.vue?raw'; import url from './Url.vue?url'; import 'external-package';`,
            'resources/js/Shell.vue': `<script setup>import { nested } from './bridge';</script><template><button>Active</button></template>`,
            'resources/js/bridge.ts': `export { default as nested } from './Nested.vue';`,
            'resources/js/Nested.vue': '<template><input /></template>',
            'resources/js/pages/docs/Guide.vue': '<template><details /></template>',
            'resources/js/UnusedStarter.vue': '<template><select /></template>',
            'resources/js/Raw.vue': '<template><textarea /></template>',
            'resources/js/Url.vue': '<template><dialog /></template>',
            'resources/js/Fixture.test.vue': '<template><meter /></template>',
            'resources/js/__tests__/Fixture.vue': '<template><progress /></template>',
        });
        expect(inventory.entries).toEqual([
            'resources/js/app.ts',
            'resources/js/pages/docs/Guide.vue',
        ]);
        expect(
            inventory.occurrences
                .filter((item) => item.reachable)
                .map((item) => item.tag)
                .sort((a, b) => a.localeCompare(b)),
        ).toEqual(['button', 'details', 'input']);
        expect(inventory.occurrences.filter((item) => !item.reachable)).toEqual([
            {
                file: 'resources/js/UnusedStarter.vue',
                line: 1,
                tag: 'select',
                kind: 'native',
                reachable: false,
            },
        ]);
        expect(inventory.files.map((item) => item.file)).not.toContain('resources/js/Raw.vue');
        expect(inventory.files.map((item) => item.file)).not.toContain('resources/js/Url.vue');
    });

    it('follows statically named lazy imports and directory indexes while rejecting authored and type-only imports', () => {
        const inventory = inventorySources({
            'resources/js/app.ts': `import type { Example } from './TypeOnly.vue'; import './nested'; const load = () => import('./Lazy.vue'); const example = "import('./Authored.vue')";`,
            'resources/js/nested/index.js': `import '../Shared.vue';`,
            'resources/js/Lazy.vue': '<template><button /></template>',
            'resources/js/Shared.vue': '<template><input /></template>',
            'resources/js/TypeOnly.vue': '<template><select /></template>',
            'resources/js/Authored.vue': '<template><textarea /></template>',
        });
        expect(
            inventory.occurrences
                .filter((item) => item.reachable)
                .map((item) => item.tag)
                .sort((a, b) => a.localeCompare(b)),
        ).toEqual(['button', 'input']);
        expect(
            inventory.occurrences
                .filter((item) => !item.reachable)
                .map((item) => item.tag)
                .sort((a, b) => a.localeCompare(b)),
        ).toEqual(['select', 'textarea']);
    });

    it('includes content-imported Vue files when they are also rendered by a local import', () => {
        const inventory = inventorySources({
            'resources/js/app.ts': `import source from './Shared.vue?raw'; import Shared from './Shared.vue';`,
            'resources/js/Shared.vue': '<template><button /></template>',
        });
        expect(inventory.occurrences).toEqual([
            {
                file: 'resources/js/Shared.vue',
                line: 1,
                tag: 'button',
                kind: 'native',
                reachable: true,
            },
        ]);
    });

    it('merges default subpath and named public component identities in its summary', () => {
        const result = inventorySources({
            'resources/js/app.ts': `import './Controls.vue';`,
            'resources/js/Controls.vue': `<script setup>
import Submit from '@artisan-toolbox/front-awesome/components/Button.vue';
import { Button } from '@artisan-toolbox/front-awesome';
</script><template><Submit /><Button /></template>`,
        });
        expect(result.summary.reachable.components).toEqual(['Button']);
        expect(result.summary.reachable.frontAwesome).toBe(2);
    });

    it('recognizes namespace components and ignores unused imported exports and type bindings', () => {
        const result = inspectSource(
            `<script setup lang="ts">
import * as Controls from '@artisan-toolbox/front-awesome';
import Submit from '@artisan-toolbox/front-awesome/components/Button.vue';
import { type Button } from '@artisan-toolbox/front-awesome';
import type { Input } from '@artisan-toolbox/front-awesome';
</script><template><Controls.Button /><Submit /><Button /><Input /></template>`,
            'Aliases.vue',
        );
        expect(
            result.occurrences.map((item) => ({ tag: item.tag, imported: item.imported })),
        ).toEqual([
            { tag: 'Controls.Button', imported: 'Button' },
            { tag: 'Submit', imported: 'default' },
        ]);
    });
});

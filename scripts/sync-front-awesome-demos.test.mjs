import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vite-plus/test';
import { babelParse, compileTemplate, parse } from 'vue/compiler-sfc';
import catalog from '../resources/js/components/docs/front-awesome/catalog/components.json';
import { blockDemoCells, syncFrontAwesomeDemos } from './sync-front-awesome-demos.mjs';

describe('Front Awesome live example synchronization', () => {
    it('keeps inline controls intrinsic while preserving conditional chains and required children', () => {
        const source = `<template>
    <div class="flex min-w-0 flex-col gap-4">
        <Rating />
        <Select v-if="ready"><Option value="a">A</Option></Select>
        <p v-else-if="loading">Loading</p>
        <p v-else>Ready</p>
        <output>{{value}}</output>
    </div>
</template>`;
        const result = blockDemoCells(source);
        expect(result.match(/<div class="min-w-0">/gu)).toHaveLength(3);
        expect(result).toContain('<Select v-if="ready"><Option value="a">A</Option></Select>');
        expect(compileTemplate({ source: result, id: 'cells' }).errors).toEqual([]);
        expect(blockDemoCells(result)).toBe(result);
    });

    it('keeps every public export discoverable through one owner scenario', () => {
        const result = syncFrontAwesomeDemos({ check: true });
        const exports = catalog.groups
            .flatMap((group) => group.components)
            .filter((item) => item.implementation.state === 'implemented');
        const owners = exports.filter(
            (item) => item.implementation.demoOwner === item.implementation.export,
        );
        expect(exports).toHaveLength(90);
        expect(owners).toHaveLength(80);
        expect(result).toMatchObject({
            implementedExports: exports.length,
            catalogOwners: owners.length,
            changed: [],
        });
        expect(result.frames).toBeGreaterThan(owners.length);
    });

    it('independently compares every framed source binding to the imported live SFC bytes', () => {
        const visited = new Set();
        let frames = 0;
        const root = process.cwd();
        function inspect(file) {
            if (visited.has(file)) return;
            visited.add(file);
            const { descriptor } = parse(readFileSync(file, 'utf8'));
            const script = babelParse(descriptor.scriptSetup?.content ?? '', {
                sourceType: 'module',
            });
            const imports = new Map();
            const values = new Map();
            for (const node of script.program.body) {
                if (node.type === 'ImportDeclaration') {
                    const path = node.source.value;
                    const imported = path.startsWith('@/')
                        ? resolve(root, 'resources/js', path.slice(2))
                        : path.startsWith('.')
                          ? resolve(file, '..', path)
                          : null;
                    for (const specifier of node.specifiers)
                        imports.set(specifier.local.name, imported);
                }
                if (node.type === 'VariableDeclaration') {
                    for (const declaration of node.declarations) {
                        if (
                            declaration.init?.type === 'TemplateLiteral' &&
                            !declaration.init.expressions.length
                        )
                            values.set(
                                declaration.id.name,
                                declaration.init.quasis[0].value.cooked,
                            );
                    }
                }
            }
            function visit(node) {
                if (node.tag === 'DemoFrame') {
                    frames++;
                    const sources = node.props.find(
                        (prop) => prop.type === 7 && prop.arg?.content === 'sources',
                    ).exp.content;
                    const array = babelParse(`(${sources})`).program.body[0].expression;
                    const live = node.children.find((child) =>
                        imports.get(child.tag)?.includes('/components/demo/front-awesome/'),
                    );
                    expect(live, file).toBeDefined();
                    for (const [index, entry] of array.elements.entries()) {
                        const properties = Object.fromEntries(
                            entry.properties.map((prop) => [prop.key.name, prop.value]),
                        );
                        let target = imports.get(live.tag);
                        if (index > 0) {
                            const candidates = [];
                            const importedFiles = new Set();
                            function importedChildren(file) {
                                if (importedFiles.has(file)) return;
                                importedFiles.add(file);
                                if (basename(file) === properties.label.value)
                                    candidates.push(file);
                                const { descriptor } = parse(readFileSync(file, 'utf8'));
                                const ast = babelParse(
                                    descriptor.scriptSetup?.content ??
                                        descriptor.script?.content ??
                                        '',
                                    { sourceType: 'module' },
                                );
                                for (const statement of ast.program.body) {
                                    if (
                                        statement.type !== 'ImportDeclaration' ||
                                        !statement.source.value.endsWith('.vue')
                                    )
                                        continue;
                                    const specifier = statement.source.value;
                                    if (specifier.startsWith('@/'))
                                        importedChildren(
                                            resolve(root, 'resources/js', specifier.slice(2)),
                                        );
                                    else if (specifier.startsWith('.'))
                                        importedChildren(resolve(file, '..', specifier));
                                }
                            }
                            importedChildren(target);
                            expect(candidates).toHaveLength(1);
                            target = candidates[0];
                        }
                        const exact = readFileSync(target, 'utf8');
                        expect(
                            values.get(properties.code.name),
                            `${file}: ${properties.code.name}`,
                        ).toBe(exact);
                        expect(parse(exact).errors).toEqual([]);
                    }
                }
                for (const child of node.children ?? []) if (child.type === 1) visit(child);
            }
            visit(descriptor.template.ast);
            for (const imported of imports.values())
                if (
                    imported?.includes('/components/docs/front-awesome/') &&
                    imported.endsWith('.vue')
                )
                    inspect(imported);
        }
        for (const group of catalog.groups) {
            const page = group.id
                .split('-')
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join('');
            inspect(
                resolve(
                    root,
                    `resources/js/pages/docs/front-awesome/web-awesome/components/${page}.vue`,
                ),
            );
        }
        expect(frames).toBeGreaterThan(80);
    });

    it('preserves source line endings, template strings, and backslashes through synchronization', () => {
        const root = mkdtempSync(resolve(tmpdir(), 'atb-demo-source-bytes-'));
        const catalogFile = resolve(
            root,
            'resources/js/components/docs/front-awesome/catalog/components.json',
        );
        const demoFile = resolve(
            root,
            'resources/js/components/demo/front-awesome/actions/ButtonDemo.vue',
        );
        const pageFile = resolve(
            root,
            'resources/js/pages/docs/front-awesome/web-awesome/components/Actions.vue',
        );
        const demo = [
            '<script setup>',
            "import { Button } from '@artisan-toolbox/front-awesome/components/WebAwesome';",
            "const path = 'C:\\\\temp\\\\example';",
            'const message = `Path: ${path}`;',
            '</script>',
            '<template><Button>{{ message }}</Button></template>',
            '',
            '',
        ].join('\r\n');
        const page = `<script setup>
import ButtonDemo from '@/components/demo/front-awesome/actions/ButtonDemo.vue';
const example = \`old source\`;
</script>
<template><DemoFrame data-catalog-demo="Button" :sources="[{ label: 'ButtonDemo.vue', code: example }]"><ButtonDemo /></DemoFrame></template>`;
        try {
            for (const file of [catalogFile, demoFile, pageFile])
                mkdirSync(resolve(file, '..'), { recursive: true });
            writeFileSync(
                catalogFile,
                JSON.stringify({
                    groups: [
                        {
                            id: 'actions',
                            components: [
                                {
                                    implementation: {
                                        state: 'implemented',
                                        export: 'Button',
                                        demoOwner: 'Button',
                                    },
                                },
                            ],
                        },
                    ],
                }),
            );
            writeFileSync(demoFile, demo);
            writeFileSync(pageFile, page);

            expect(syncFrontAwesomeDemos({ root }).changed).toEqual([pageFile]);

            const { descriptor, errors } = parse(readFileSync(pageFile, 'utf8'));
            expect(errors).toEqual([]);
            const declaration = babelParse(descriptor.scriptSetup.content, {
                sourceType: 'module',
            }).program.body.find((statement) => statement.type === 'VariableDeclaration');
            expect(declaration.declarations[0].init.quasis[0].value.cooked).toBe(demo);
            expect(syncFrontAwesomeDemos({ root, check: true }).changed).toEqual([]);
            expect(readFileSync(demoFile, 'utf8')).toBe(demo);
        } finally {
            rmSync(root, { recursive: true, force: true });
        }
    });

    it('rejects malformed ownership, duplicate mounts, and unknown source bindings without writing', () => {
        const root = mkdtempSync(resolve(tmpdir(), 'atb-demo-sync-'));
        const catalogFile = resolve(
            root,
            'resources/js/components/docs/front-awesome/catalog/components.json',
        );
        const demoFile = resolve(
            root,
            'resources/js/components/demo/front-awesome/actions/SelectDemo.vue',
        );
        const pageFile = resolve(
            root,
            'resources/js/pages/docs/front-awesome/web-awesome/components/Actions.vue',
        );
        const metadata = {
            groups: [
                {
                    id: 'actions',
                    components: ['Select', 'Option'].map((name) => ({
                        implementation: { state: 'implemented', export: name, demoOwner: 'Select' },
                    })),
                },
            ],
        };
        const frame =
            '<DemoFrame data-catalog-demo="Select" :sources="[{ label: \'Select.vue\', code: example }]"> <SelectDemo /> </DemoFrame>';
        function save(file, value) {
            mkdirSync(resolve(file, '..'), { recursive: true });
            writeFileSync(file, value);
        }
        function page(frames = frame, name = 'example') {
            return (
                "<script setup>\nimport SelectDemo from '@/components/demo/front-awesome/actions/SelectDemo.vue';\nconst " +
                name +
                ' = `outdated`;\n</script>\n<template><div>' +
                frames +
                '</div></template>'
            );
        }
        try {
            save(catalogFile, JSON.stringify(metadata));
            save(
                demoFile,
                "<script setup>import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';</script><template><Select><Option /></Select></template>",
            );
            save(pageFile, page());
            expect(syncFrontAwesomeDemos({ root, check: true })).toMatchObject({
                implementedExports: 2,
                catalogOwners: 1,
                frames: 1,
                changed: [pageFile],
            });
            expect(readFileSync(pageFile, 'utf8')).toBe(page());
            const helper = '<template><!-- </SCRIPT> --><span>Choice label</span></template>';
            save(resolve(demoFile, '..', 'ChoiceLabel.vue'), helper);
            save(
                demoFile,
                "<script setup>import ChoiceLabel from './ChoiceLabel.vue';import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';</script><template><Select><Option><ChoiceLabel /></Option></Select></template>",
            );
            const multipleSources = page(
                frame.replace(
                    'code: example }]',
                    "code: example }, { label: 'ChoiceLabel.vue', code: helper }]",
                ),
            ).replace('const example', 'const helper = `old helper`;\nconst example');
            save(pageFile, multipleSources);
            expect(syncFrontAwesomeDemos({ root }).changed).toEqual([pageFile]);
            const updated = parse(readFileSync(pageFile, 'utf8')).descriptor.scriptSetup.content;
            const literals = babelParse(updated, { sourceType: 'module' })
                .program.body.filter((statement) => statement.type === 'VariableDeclaration')
                .flatMap((statement) => statement.declarations)
                .map((declaration) => declaration.init.quasis[0].value.cooked);
            expect(literals).toContain(helper);
            expect(literals).toContain(readFileSync(demoFile, 'utf8'));
            expect(syncFrontAwesomeDemos({ root, check: true }).changed).toEqual([]);
            const unknownHelper = multipleSources.replace(
                "label: 'ChoiceLabel.vue'",
                "label: 'MissingLabel.vue'",
            );
            save(pageFile, unknownHelper);
            expect(() => syncFrontAwesomeDemos({ root })).toThrow(
                'additional source label must identify one imported SFC filename',
            );
            expect(readFileSync(pageFile, 'utf8')).toBe(unknownHelper);
            save(resolve(demoFile, '..', 'nested/ChoiceLabel.vue'), helper);
            save(
                demoFile,
                "<script setup>import ChoiceLabel from './ChoiceLabel.vue';import OtherLabel from './nested/ChoiceLabel.vue';import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';</script><template><Select><Option><ChoiceLabel /><OtherLabel /></Option></Select></template>",
            );
            save(pageFile, multipleSources);
            expect(() => syncFrontAwesomeDemos({ root })).toThrow(
                'additional source label must identify one imported SFC filename',
            );
            expect(readFileSync(pageFile, 'utf8')).toBe(multipleSources);
            save(
                demoFile,
                "<script setup>import { Select, Option } from '@artisan-toolbox/front-awesome/components/WebAwesome';</script><template><Select><Option /></Select></template>",
            );
            save(
                pageFile,
                page().replace(
                    'const example',
                    'const abandoned = `<template><Select><Option /></Select></template>`;\nconst example',
                ),
            );
            expect(() => syncFrontAwesomeDemos({ root, check: true })).toThrow(
                'unused authored SFC source binding abandoned',
            );
            save(pageFile, page(''));
            expect(() => syncFrontAwesomeDemos({ root, check: true })).toThrow(
                'exactly one canonical',
            );
            save(pageFile, page(frame + frame));
            expect(() => syncFrontAwesomeDemos({ root, check: true })).toThrow(
                'exactly one canonical',
            );
            save(pageFile, page(frame, 'other'));
            expect(() => syncFrontAwesomeDemos({ root, check: true })).toThrow(
                'unknown static source binding',
            );
            save(pageFile, page());
            for (const owner of ['Missing', 'Option']) {
                metadata.groups[0].components[0].implementation.demoOwner = owner;
                save(catalogFile, JSON.stringify(metadata));
                expect(() => syncFrontAwesomeDemos({ root, check: true })).toThrow(
                    'self-owned implemented demoOwner',
                );
            }
        } finally {
            rmSync(root, { recursive: true, force: true });
        }
    });
});

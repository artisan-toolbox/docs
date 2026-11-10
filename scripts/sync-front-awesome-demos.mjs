import { readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { babelParse, parse } from 'vue/compiler-sfc';

const groupPages = {
    actions: 'Actions',
    forms: 'Forms',
    layout: 'Layout',
    navigation: 'Navigation',
    feedback: 'Feedback',
    media: 'Media',
    'data-viz': 'DataViz',
    helpers: 'Helpers',
};
const element = 1;
const attribute = (node, name) =>
    node.props.find((prop) => prop.type === 6 && prop.name === name)?.value?.content;
const binding = (node, name) =>
    node.props.find((prop) => prop.type === 7 && prop.name === 'bind' && prop.arg?.content === name)
        ?.exp?.content;
const apply = (source, edits) =>
    edits
        .sort((a, b) => b.start - a.start)
        .reduce(
            (result, edit) => result.slice(0, edit.start) + edit.text + result.slice(edit.end),
            source,
        );

export function blockDemoCells(source, filename = 'Demo.vue') {
    const { descriptor, errors } = parse(source, { filename });
    if (errors.length) throw errors[0];
    const root = descriptor.template.ast.children.find((node) => node.type === element);
    if (!attribute(root, 'class')?.split(/\s+/u).includes('flex-col')) return source;
    const children = root.children.filter((node) => node.type === element);
    if (children.every((node) => node.tag === 'div' && attribute(node, 'class') === 'min-w-0'))
        return source;
    const groups = [];
    for (const child of children) {
        const continuation = child.props.some(
            (prop) => prop.type === 7 && ['else', 'else-if'].includes(prop.name),
        );
        if (continuation) groups.at(-1).push(child);
        else groups.push([child]);
    }
    if (!groups.length) return source;
    const cells = groups.map((group) => {
        const content = source.slice(group[0].loc.start.offset, group.at(-1).loc.end.offset);
        const indented = content
            .split('\n')
            .map((line, index) => (index ? `    ${line}` : `            ${line}`))
            .join('\n');
        return `        <div class="min-w-0">\n${indented}\n        </div>`;
    });
    return apply(source, [
        {
            start: children[0].loc.start.offset,
            end: children.at(-1).loc.end.offset,
            text: cells.join('\n').trimStart(),
        },
    ]);
}

function templateLiteral(source) {
    return (
        '`' +
        source
            .replace(/\\/gu, '\\\\')
            .replace(/\r/gu, '\\r')
            .replace(/`/gu, '\\`')
            .replace(/\$\{/gu, '\\${')
            .replace(/<\/script>/giu, (closing) => '\\x3C' + closing.slice(1)) +
        '`'
    );
}

export function validateDemoOwners(catalog) {
    const owners = [];
    let implementedExports = 0;
    for (const group of catalog.groups) {
        const implemented = group.components.filter(
            (item) => item.implementation.state === 'implemented',
        );
        const exports = new Map(implemented.map((item) => [item.implementation.export, item]));
        if (exports.size !== implemented.length)
            throw new Error(`${group.id}: duplicate public export.`);
        for (const item of implemented) {
            implementedExports++;
            const implementation = item.implementation;
            const owner = exports.get(implementation.demoOwner);
            if (!owner || owner.implementation.demoOwner !== owner.implementation.export) {
                throw new Error(
                    `${group.id}: ${implementation.export} needs a self-owned implemented demoOwner in its category.`,
                );
            }
            if (implementation.demoOwner === implementation.export)
                owners.push({ group: group.id, item });
        }
    }
    return { owners, implementedExports };
}

function importedFile(root, file, specifier) {
    if (specifier.startsWith('@/')) return resolve(root, 'resources/js', specifier.slice(2));
    if (specifier.startsWith('.')) return resolve(file, '..', specifier);
    return null;
}

function importedSourceFiles(root, file, visited = new Set()) {
    if (visited.has(file)) return [];
    visited.add(file);
    const { descriptor } = parse(readFileSync(file, 'utf8'), { filename: file });
    const script = babelParse(descriptor.scriptSetup?.content ?? descriptor.script?.content ?? '', {
        sourceType: 'module',
    });
    const children = script.program.body
        .filter(
            (statement) =>
                statement.type === 'ImportDeclaration' && statement.source.value.endsWith('.vue'),
        )
        .map((statement) => importedFile(root, file, statement.source.value))
        .filter(Boolean);
    return [file, ...children.flatMap((child) => importedSourceFiles(root, child, visited))];
}

export function discoverFrontAwesomeFrames(root, catalog) {
    const files = new Map();
    const frames = [];
    function inspect(file, stack = []) {
        if (stack.includes(file)) throw new Error(`${file}: recursive authored component import.`);
        const ancestry = [...stack, file];
        const source = readFileSync(file, 'utf8');
        const { descriptor, errors } = parse(source, { filename: file });
        if (errors.length) throw errors[0];
        const ast = babelParse(descriptor.scriptSetup?.content ?? '', { sourceType: 'module' });
        const imports = new Map();
        const declarations = new Map();
        for (const statement of ast.program.body) {
            if (statement.type === 'ImportDeclaration') {
                const imported = importedFile(root, file, statement.source.value);
                for (const specifier of statement.specifiers)
                    imports.set(specifier.local.name, imported);
            }
            if (statement.type === 'VariableDeclaration') {
                for (const declaration of statement.declarations)
                    declarations.set(declaration.id.name, declaration.init);
            }
        }
        const usedSources = new Set();
        files.set(file, { source, descriptor, declarations, usedSources });
        function visit(node) {
            const codeBinding = node.type === element ? binding(node, 'code') : null;
            if (codeBinding) usedSources.add(codeBinding.trim());
            if (node.tag === 'DemoFrame') {
                const expression = binding(node, 'sources');
                if (!expression) throw new Error(`${file}: DemoFrame needs a sources binding.`);
                const array = babelParse(`(${expression})`).program.body[0].expression;
                if (array.type !== 'ArrayExpression' || !array.elements.length)
                    throw new Error(`${file}: DemoFrame sources must be a nonempty array.`);
                const demoChildren = node.children.filter(
                    (child) =>
                        child.type === element &&
                        imports.get(child.tag)?.includes('/components/demo/front-awesome/'),
                );
                if (demoChildren.length !== 1)
                    throw new Error(`${file}: DemoFrame must mount one imported live demo.`);
                const liveFile = imports.get(demoChildren[0].tag);
                const sources = array.elements.map((entry, index) => {
                    const code = entry.properties?.find((prop) => prop.key?.name === 'code')?.value;
                    const declaration =
                        code?.type === 'Identifier' ? declarations.get(code.name) : null;
                    if (
                        !declaration ||
                        declaration.type !== 'TemplateLiteral' ||
                        declaration.expressions.length
                    ) {
                        throw new Error(
                            `${file}: unknown static source binding ${code?.name ?? 'expression'}.`,
                        );
                    }
                    const label = entry.properties.find(
                        (prop) => prop.key?.name === 'label',
                    )?.value;
                    const candidates =
                        index === 0
                            ? [liveFile]
                            : importedSourceFiles(root, liveFile).filter(
                                  (candidate) => basename(candidate) === label?.value,
                              );
                    if (candidates.length !== 1)
                        throw new Error(
                            `${file}: additional source label must identify one imported SFC filename.`,
                        );
                    const sourceFile = candidates[0];
                    usedSources.add(code.name);
                    return { name: code.name, declaration, file: sourceFile };
                });
                frames.push({
                    file,
                    liveFile,
                    owner: attribute(node, 'data-catalog-demo'),
                    sources,
                });
            }
            for (const child of node.children ?? []) if (child.type === element) visit(child);
            const imported = imports.get(node.tag);
            if (imported?.includes('/components/docs/front-awesome/') && imported.endsWith('.vue'))
                inspect(imported, ancestry);
        }
        if (descriptor.template) visit(descriptor.template.ast);
    }
    for (const group of catalog.groups)
        inspect(
            resolve(
                root,
                `resources/js/pages/docs/front-awesome/web-awesome/components/${groupPages[group.id]}.vue`,
            ),
        );
    for (const [file, { declarations, usedSources }] of files) {
        for (const [name, declaration] of declarations) {
            if (
                usedSources.has(name) ||
                declaration?.type !== 'TemplateLiteral' ||
                declaration.expressions.length
            )
                continue;
            const literal = declaration.quasis[0].value.cooked;
            if (literal && parse(literal).descriptor.template)
                throw new Error(`${file}: unused authored SFC source binding ${name}.`);
        }
    }
    return { files, frames };
}

export function syncFrontAwesomeDemos({ root = process.cwd(), check = false } = {}) {
    const catalog = JSON.parse(
        readFileSync(
            resolve(root, 'resources/js/components/docs/front-awesome/catalog/components.json'),
            'utf8',
        ),
    );
    const { owners, implementedExports } = validateDemoOwners(catalog);
    const { files, frames } = discoverFrontAwesomeFrames(root, catalog);
    for (const { group, item } of owners) {
        const name = item.implementation.export;
        const expected = resolve(
            root,
            `resources/js/components/demo/front-awesome/${group}/${name}Demo.vue`,
        );
        const matches = frames.filter((frame) => frame.owner === name);
        if (
            matches.length !== 1 ||
            matches[0].liveFile !== expected ||
            frames.filter((frame) => frame.liveFile === expected).length !== 1
        ) {
            throw new Error(`${name}: expected exactly one canonical catalog owner frame.`);
        }
        const source = readFileSync(expected, 'utf8');
        const descriptor = parse(source, { filename: expected }).descriptor;
        const imports = babelParse(descriptor.scriptSetup?.content ?? '', {
            sourceType: 'module',
        }).program.body.filter(
            (statement) =>
                statement.type === 'ImportDeclaration' &&
                statement.source.value.startsWith('@artisan-toolbox/front-awesome/components'),
        );
        const companions = catalog.groups
            .find((entry) => entry.id === group)
            .components.filter((entry) => entry.implementation.demoOwner === name);
        for (const companion of companions) {
            const exported = companion.implementation.export;
            const names = imports.flatMap((statement) =>
                statement.specifiers
                    .filter((specifier) =>
                        specifier.type === 'ImportSpecifier'
                            ? specifier.imported.name === exported
                            : statement.source.value.endsWith(`/${exported}.vue`),
                    )
                    .map((specifier) => specifier.local.name),
            );
            if (
                !names.some((local) =>
                    new RegExp(`<${local}(?=[\\s/>])`, 'u').test(descriptor.template.content),
                )
            ) {
                throw new Error(`${name}: owner demo must import and render public ${exported}.`);
            }
        }
    }
    if (frames.filter((frame) => frame.owner).length !== owners.length)
        throw new Error('Unknown catalog owner frame.');
    const edits = new Map();
    for (const frame of frames) {
        const { descriptor } = files.get(frame.file);
        for (const source of frame.sources) {
            const text = templateLiteral(readFileSync(source.file, 'utf8'));
            const edit = {
                start: descriptor.scriptSetup.loc.start.offset + source.declaration.start,
                end: descriptor.scriptSetup.loc.start.offset + source.declaration.end,
                text,
            };
            const existing = edits.get(frame.file) ?? new Map();
            if (existing.has(edit.start) && existing.get(edit.start).text !== text)
                throw new Error(`${frame.file}: one source binding targets different demos.`);
            existing.set(edit.start, edit);
            edits.set(frame.file, existing);
        }
    }
    const changed = [];
    for (const [file, updates] of edits) {
        const before = files.get(file).source;
        const after = apply(before, [...updates.values()]);
        if (before === after) continue;
        changed.push(file);
        if (!check) writeFileSync(file, after);
    }
    return { changed, implementedExports, catalogOwners: owners.length, frames: frames.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const check = process.argv.includes('--check');
    const result = syncFrontAwesomeDemos({ check });
    console.log(
        `${result.implementedExports} public exports; ${result.catalogOwners} catalog owners; ${result.frames} frames checked; ${result.changed.length} files ${check ? 'need synchronization' : 'synchronized'}.`,
    );
    if (check && result.changed.length) process.exitCode = 1;
}

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseTemplate, NodeTypes } from '@vue/compiler-dom';
import { parse as parseComponent } from '@vue/compiler-sfc';
import ts from 'typescript';

const packageName = '@artisan-toolbox/front-awesome';
const nativeControls = new Set([
    'button',
    'input',
    'select',
    'textarea',
    'details',
    'dialog',
    'progress',
    'meter',
]);
const sourceExtensions = ['.vue', '.ts', '.js', '.tsx', '.jsx', '.mjs'];
const isTest = (file) =>
    /(?:^|\/)(?:__tests__|tests)\//u.test(file) || /\.(?:test|spec)\./u.test(file);
const kebab = (name) => name.replace(/\B([A-Z])/gu, '-$1').toLowerCase();

/** Inspect executable script imports and rendered template nodes, never authored source strings. */
export function inspectSource(source, file) {
    const imports = [];
    const components = new Map();
    const occurrences = [];
    let scripts = [{ content: source }];
    let template;

    if (file.endsWith('.vue')) {
        const { descriptor, errors } = parseComponent(source, { filename: file });
        if (errors.length) throw new Error(`${file}: ${errors[0].message ?? errors[0]}`);
        scripts = [descriptor.script, descriptor.scriptSetup].filter(Boolean);
        template = descriptor.template;
    }

    for (const script of scripts) {
        const ast = ts.createSourceFile(
            file,
            script.content,
            ts.ScriptTarget.Latest,
            true,
            /\.[jt]sx$/u.test(file) || ['jsx', 'tsx'].includes(script.lang)
                ? ts.ScriptKind.TSX
                : ts.ScriptKind.TS,
        );
        function visit(node) {
            if (
                (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
                node.moduleSpecifier &&
                ts.isStringLiteral(node.moduleSpecifier)
            ) {
                const specifier = node.moduleSpecifier.text;
                if (!node.isTypeOnly && !node.importClause?.isTypeOnly) imports.push(specifier);
                if (
                    ts.isImportDeclaration(node) &&
                    !node.importClause?.isTypeOnly &&
                    (specifier === packageName || specifier.startsWith(`${packageName}/`))
                ) {
                    const clause = node.importClause;
                    if (clause?.name)
                        components.set(clause.name.text, {
                            imported: 'default',
                            source: specifier,
                        });
                    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
                        for (const binding of clause.namedBindings.elements) {
                            if (!binding.isTypeOnly)
                                components.set(binding.name.text, {
                                    imported: binding.propertyName?.text ?? binding.name.text,
                                    source: specifier,
                                });
                        }
                    }
                    if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
                        components.set(`${clause.namedBindings.name.text}.`, {
                            imported: '*',
                            source: specifier,
                        });
                    }
                }
            }
            if (
                ts.isCallExpression(node) &&
                node.expression.kind === ts.SyntaxKind.ImportKeyword &&
                node.arguments.length === 1 &&
                ts.isStringLiteral(node.arguments[0])
            )
                imports.push(node.arguments[0].text);
            ts.forEachChild(node, visit);
        }
        visit(ast);
    }

    if (template) {
        const ast = parseTemplate(template.content);
        function visit(node) {
            if (node.type === NodeTypes.ELEMENT) {
                const occurrence = {
                    file,
                    line: template.loc.start.line + node.loc.start.line - 1,
                    tag: node.tag,
                };
                if (nativeControls.has(node.tag))
                    occurrences.push({ ...occurrence, kind: 'native' });
                else if (node.tag.startsWith('wa-'))
                    occurrences.push({ ...occurrence, kind: 'raw-web-awesome' });
                else {
                    for (const [local, component] of components) {
                        if (
                            component.imported === '*'
                                ? node.tag.startsWith(local)
                                : node.tag === local || node.tag === kebab(local)
                        ) {
                            occurrences.push({
                                ...occurrence,
                                kind: 'front-awesome',
                                local,
                                imported:
                                    component.imported === '*'
                                        ? node.tag.slice(local.length)
                                        : component.imported,
                                source: component.source,
                            });
                            break;
                        }
                    }
                }
            }
            for (const child of node.children ?? []) visit(child);
        }
        visit(ast);
    }
    return { imports, occurrences };
}

function resolveImport(specifier, importer, files, aliasRoot) {
    const clean = specifier.split('?')[0];
    const target = clean.startsWith('@/')
        ? posix.join(aliasRoot, clean.slice(2))
        : clean.startsWith('.')
          ? posix.join(posix.dirname(importer), clean)
          : null;
    if (!target) return null;
    return (
        [
            target,
            ...sourceExtensions.map((extension) => target + extension),
            ...sourceExtensions.map((extension) => `${target}/index${extension}`),
        ].find((candidate) => files.has(candidate)) ?? null
    );
}

/** Build rendered-control evidence from an inline source map or filesystem-loaded sources. */
export function inventorySources(sources, { aliasRoot = 'resources/js', entries } = {}) {
    const files = new Map(Object.entries(sources).filter(([file]) => !isTest(file)));
    const inspected = new Map(
        [...files].map(([file, source]) => [file, inspectSource(source, file)]),
    );
    const roots =
        entries ??
        [...files.keys()].filter(
            (file) =>
                file === `${aliasRoot}/app.ts` ||
                (file.startsWith(`${aliasRoot}/pages/`) && file.endsWith('.vue')),
        );
    const graph = new Map();
    const contentImports = new Set();
    for (const [file, result] of inspected) {
        const dependencies = [];
        for (const specifier of result.imports) {
            const target = resolveImport(specifier, file, files, aliasRoot);
            if (!target) continue;
            if (/[?&](?:raw|url)(?:[=&]|$)/u.test(specifier)) contentImports.add(target);
            else dependencies.push(target);
        }
        graph.set(file, dependencies);
    }
    const reachable = new Set();
    function visit(file) {
        if (!files.has(file) || reachable.has(file)) return;
        reachable.add(file);
        for (const dependency of graph.get(file)) visit(dependency);
    }
    roots.forEach(visit);
    const records = [...inspected]
        .filter(([file]) => reachable.has(file) || !contentImports.has(file))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([file, result]) => ({
            file,
            reachable: reachable.has(file),
            imports: graph.get(file),
            occurrences: result.occurrences,
        }));
    const occurrences = records.flatMap((record) =>
        record.occurrences.map((occurrence) => ({ ...occurrence, reachable: record.reachable })),
    );
    const summary = {};
    for (const group of ['reachable', 'unreachable']) {
        const selected = occurrences.filter(
            (occurrence) => occurrence.reachable === (group === 'reachable'),
        );
        summary[group] = {
            files: records.filter((record) => record.reachable === (group === 'reachable')).length,
            native: selected.filter((occurrence) => occurrence.kind === 'native').length,
            rawWebAwesome: selected.filter((occurrence) => occurrence.kind === 'raw-web-awesome')
                .length,
            frontAwesome: selected.filter((occurrence) => occurrence.kind === 'front-awesome')
                .length,
            components: [
                ...new Set(
                    selected
                        .filter((occurrence) => occurrence.kind === 'front-awesome')
                        .map((occurrence) =>
                            occurrence.imported === 'default'
                                ? posix.basename(occurrence.source).replace(/\.vue$/u, '')
                                : occurrence.imported,
                        ),
                ),
            ].sort((a, b) => a.localeCompare(b)),
        };
    }
    return {
        entries: roots.toSorted((a, b) => a.localeCompare(b)),
        summary,
        files: records,
        occurrences,
    };
}

export function inventoryApplication(
    root = resolve(dirname(fileURLToPath(import.meta.url)), '..'),
) {
    const sources = {};
    function visit(directory) {
        for (const entry of readdirSync(resolve(root, directory), { withFileTypes: true })) {
            const file = `${directory}/${entry.name}`;
            if (entry.isDirectory()) visit(file);
            else if (sourceExtensions.includes(extname(file)) && !isTest(file))
                sources[file] = readFileSync(resolve(root, file), 'utf8');
        }
    }
    visit('resources/js');
    return inventorySources(sources);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const inventory = inventoryApplication();
    if (process.argv.includes('--json')) console.log(JSON.stringify(inventory, null, 2));
    else {
        for (const group of ['reachable', 'unreachable']) {
            const count = inventory.summary[group];
            console.log(
                `${group}: ${count.files} files, ${count.native} native controls, ${count.rawWebAwesome} raw WA tags, ${count.frontAwesome} public wrapper uses (${count.components.length} components)`,
            );
        }
        for (const occurrence of inventory.occurrences.filter(
            (item) => item.reachable && item.kind !== 'front-awesome',
        )) {
            console.log(`${occurrence.file}:${occurrence.line} <${occurrence.tag}>`);
        }
    }
}

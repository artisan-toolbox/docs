import { readFileSync, realpathSync } from 'node:fs';
import { dirname, relative, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { babelParse, parse } from 'vue/compiler-sfc';

const NodeType = {
    element: 1,
    text: 2,
    interpolation: 5,
    attribute: 6,
    directive: 7,
};
const ignoredComponents = new Set([
    'SiteIcon',
    'PageHeader',
    'PackageGuideHeader',
    'PackageSpecs',
    'PackageBadges',
    'PackageCard',
]);
const runtimeDirectives = new Set(['if', 'else', 'else-if', 'for', 'html', 'text', 'show']);
const normalized = (value) => String(value).replace(/\s+/gu, ' ').trim();
const propName = (name) => name.replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());

export function extractDocumentation(pages, { root = process.cwd() } = {}) {
    const sourceRoot = realpathSync(resolve(root, 'resources/js'));
    const parsed = new Map();
    const documents = [];
    let componentCatalog;

    function catalog() {
        componentCatalog ??= JSON.parse(
            readFileSync(
                resolve(sourceRoot, 'components/docs/front-awesome/catalog/components.json'),
                'utf8',
            ),
        );
        return componentCatalog;
    }

    function fail(file, node, message) {
        throw new Error(`${relative(root, file)}:${node?.loc?.start?.line ?? 1}: ${message}`);
    }

    function assertStatic(node, component) {
        if (
            node.props.some(
                (item) => item.type === NodeType.directive && runtimeDirectives.has(item.name),
            )
        ) {
            fail(
                component.file,
                node,
                'Searchable prose must not depend on runtime directives. Move dynamic output into a demo.',
            );
        }
    }

    function readComponent(file) {
        const canonical = realpathSync(file);
        if (relative(sourceRoot, canonical).startsWith('..') || !canonical.endsWith('.vue')) {
            throw new Error(
                `Search content must be a Vue file inside resources/js: ${relative(root, file)}`,
            );
        }
        if (parsed.has(canonical)) return parsed.get(canonical);
        const source = readFileSync(canonical, 'utf8');
        const { descriptor, errors } = parse(source, { filename: canonical });
        if (errors.length) throw new Error(`${relative(root, canonical)}: ${errors[0]}`);
        if (!descriptor.template?.ast || descriptor.template.lang) {
            throw new Error(
                `${relative(root, canonical)}: Search requires a standard Vue template.`,
            );
        }
        const imports = new Map();
        const bindings = new Map();
        for (const script of [descriptor.script, descriptor.scriptSetup].filter(Boolean)) {
            const ast = babelParse(script.content, {
                sourceType: 'module',
                plugins: ['typescript'],
                startLine: script.loc.start.line,
            });
            for (const statement of ast.program.body) {
                if (statement.type === 'ImportDeclaration') {
                    for (const item of statement.specifiers)
                        imports.set(item.local.name, statement.source.value);
                }
                const declaration = statement.declaration ?? statement;
                if (declaration.type === 'VariableDeclaration') {
                    for (const item of declaration.declarations) {
                        if (item.id.type === 'Identifier') bindings.set(item.id.name, item.init);
                    }
                }
            }
        }
        const component = {
            file: canonical,
            template: descriptor.template.ast,
            imports,
            bindings,
        };
        parsed.set(canonical, component);
        return component;
    }

    function value(node, scope, component) {
        if (!node) fail(component.file, node, 'Missing static content value.');
        if (['StringLiteral', 'NumericLiteral', 'BooleanLiteral'].includes(node.type))
            return node.value;
        if (node.type === 'NullLiteral') return null;
        if (node.type === 'Identifier') return scope.lookup(node.name, node);
        if (node.type === 'TemplateLiteral') {
            return node.quasis
                .map(
                    (part, index) =>
                        (part.value.cooked ?? part.value.raw) +
                        (index < node.expressions.length
                            ? value(node.expressions[index], scope, component)
                            : ''),
                )
                .join('');
        }
        if (
            node.type === 'TaggedTemplateExpression' &&
            node.tag.type === 'MemberExpression' &&
            node.tag.object.name === 'String' &&
            node.tag.property.name === 'raw' &&
            !node.tag.computed
        ) {
            return node.quasi.quasis
                .map(
                    (part, index) =>
                        part.value.raw +
                        (index < node.quasi.expressions.length
                            ? value(node.quasi.expressions[index], scope, component)
                            : ''),
                )
                .join('');
        }
        if (node.type === 'ArrayExpression')
            return node.elements.map((item) => value(item, scope, component));
        if (node.type === 'ObjectExpression') {
            const result = Object.create(null);
            for (const property of node.properties) {
                if (property.type !== 'ObjectProperty' || property.computed)
                    fail(
                        component.file,
                        property,
                        'Use literal properties for searchable content.',
                    );
                result[property.key.name ?? property.key.value] = value(
                    property.value,
                    scope,
                    component,
                );
            }
            return result;
        }
        if (node.type === 'MemberExpression' && !node.optional) {
            const object = value(node.object, scope, component);
            const key = node.computed ? value(node.property, scope, component) : node.property.name;
            if (object !== null && typeof object === 'object' && Object.hasOwn(object, key))
                return object[key];
            fail(component.file, node, `Unresolved searchable property ${key}.`);
        }
        if (node.type === 'CallExpression' && node.callee.name === 'defineProps')
            return scope.props;
        fail(
            component.file,
            node,
            `Search content must be static; unsupported ${node.type}. Move runtime output into a demo or use literal authored content.`,
        );
    }

    function expression(source, scope, component, node) {
        let ast;
        try {
            ast = babelParse(`(${source})`, { sourceType: 'module' }).program.body[0].expression;
        } catch {
            fail(component.file, node, `Cannot parse searchable expression ${source}.`);
        }
        return value(ast, scope, component);
    }

    function scopeFor(component, props, slots) {
        const resolving = new Set();
        const scope = {
            props,
            slots,
            lookup(name, node) {
                if (Object.hasOwn(props, name)) return props[name];
                if (!component.bindings.has(name))
                    fail(component.file, node, `Unresolved searchable binding ${name}.`);
                if (resolving.has(name))
                    fail(component.file, node, `Circular searchable binding ${name}.`);
                resolving.add(name);
                try {
                    return value(component.bindings.get(name), scope, component);
                } finally {
                    resolving.delete(name);
                }
            },
        };
        return scope;
    }

    function attribute(node, name, scope, component, fallback = null) {
        const property = node.props.find(
            (item) =>
                (item.type === NodeType.attribute && item.name === name) ||
                (item.type === NodeType.directive &&
                    item.name === 'bind' &&
                    item.arg?.content === name),
        );
        if (!property) return fallback;
        if (property.type === NodeType.attribute) return property.value?.content ?? '';
        return expression(property.exp.content, scope, component, property);
    }

    for (const page of pages) {
        const pageDocuments = [];
        const anchors = new Set();
        const catalogTargets = new Set();
        let current = {
            heading: null,
            anchor: null,
            chunks: [page.description],
        };
        function flush() {
            pageDocuments.push({
                slug: page.slug,
                title: page.title,
                packageTitle: page.packageTitle,
                heading: current.heading,
                anchor: current.anchor,
                body: normalized(current.chunks.join(' ')),
            });
        }
        function heading(title, anchor, component, node) {
            if (typeof title !== 'string' || typeof anchor !== 'string' || !anchor)
                fail(
                    component.file,
                    node,
                    'Every searchable heading needs a static title and a stable nonempty ID.',
                );
            if (anchor && anchors.has(anchor))
                fail(component.file, node, `Duplicate search anchor ${anchor}.`);
            if (anchor) anchors.add(anchor);
            flush();
            current = { heading: normalized(title), anchor, chunks: [] };
        }
        function append(content) {
            if (Array.isArray(content)) content.forEach(append);
            else if (content !== null && content !== undefined)
                current.chunks.push(String(content));
        }
        function text(nodes, scope, component) {
            return nodes
                .map((node) => {
                    if (node.type === NodeType.text) return node.content;
                    if (node.type === NodeType.interpolation)
                        return expression(node.content.content, scope, component, node);
                    if (node.type === NodeType.element) {
                        assertStatic(node, component);
                        const imported = component.imports.get(node.tag);
                        if (
                            node.tagType === 1 &&
                            basename(imported ?? node.tag, '.vue') !== 'DocsLink'
                        ) {
                            fail(
                                component.file,
                                node,
                                `Unsupported searchable heading component ${node.tag}.`,
                            );
                        }
                    }
                    return text(node.children ?? [], scope, component);
                })
                .join(' ');
        }
        function visitComponent(file, props, stack, slots = new Map()) {
            const component = readComponent(file);
            if (stack.includes(component.file))
                fail(component.file, null, 'Circular Vue content import.');
            visit(component.template.children, scopeFor(component, props, slots), component, [
                ...stack,
                component.file,
            ]);
        }
        function visit(nodes, scope, component, stack) {
            for (const node of nodes) {
                if (node.type === NodeType.text) {
                    append(node.content);
                    continue;
                }
                if (node.type === NodeType.interpolation) {
                    append(expression(node.content.content, scope, component, node));
                    continue;
                }
                if (node.type !== NodeType.element) continue;
                const hasAttribute = (name) =>
                    node.props.some(
                        (item) => item.type === NodeType.attribute && item.name === name,
                    );
                if (
                    hasAttribute('data-search-exclude') ||
                    hasAttribute('data-docs-outline-exclude') ||
                    ['script', 'style', 'svg', 'button', 'input', 'select', 'textarea'].includes(
                        node.tag,
                    )
                )
                    continue;
                const imported = component.imports.get(node.tag);
                const name = imported ? basename(imported, '.vue') : node.tag;
                const importedFile = imported?.endsWith('.vue')
                    ? imported.startsWith('@/')
                        ? resolve(sourceRoot, imported.slice(2))
                        : resolve(dirname(component.file), imported)
                    : null;
                if (importedFile === resolve(sourceRoot, 'components/demo/DemoFrame.vue')) {
                    assertStatic(node, component);
                    const sources = attribute(node, 'sources', scope, component, []);
                    if (!Array.isArray(sources))
                        fail(component.file, node, 'DemoFrame sources must be a static array.');
                    for (const source of sources) {
                        if (
                            !source ||
                            typeof source.label !== 'string' ||
                            typeof source.code !== 'string'
                        )
                            fail(
                                component.file,
                                node,
                                'DemoFrame sources need static labels and code.',
                            );
                        append([source.label, source.code]);
                    }
                    continue;
                }
                if (ignoredComponents.has(name) || imported?.includes('/components/demo/'))
                    continue;
                assertStatic(node, component);
                if (
                    importedFile ===
                        resolve(
                            sourceRoot,
                            'components/docs/front-awesome/catalog/ComponentCatalog.vue',
                        ) ||
                    importedFile ===
                        resolve(
                            sourceRoot,
                            'components/docs/front-awesome/catalog/CatalogOverview.vue',
                        )
                ) {
                    if (name === 'CatalogOverview') {
                        for (const group of catalog().groups) {
                            const counts = Object.entries(catalog().statuses)
                                .map(
                                    ([state, status]) =>
                                        `${group.components.filter((item) => item.implementation.state === state).length} ${status.countLabel}`,
                                )
                                .join(' · ');
                            append([group.title, group.help, counts]);
                        }
                    } else {
                        const groupId = attribute(node, 'group', scope, component);
                        const group = catalog().groups.find((item) => item.id === groupId);
                        if (!group)
                            fail(
                                component.file,
                                node,
                                `Unknown component catalog group ${groupId}.`,
                            );
                        for (const item of group.components) {
                            const implemented = item.implementation.state === 'implemented';
                            if (implemented) {
                                if (!item.implementation.anchor)
                                    fail(
                                        component.file,
                                        node,
                                        `Missing implementation anchor for ${item.name}.`,
                                    );
                                catalogTargets.add(item.implementation.anchor);
                            } else if (
                                !['in-progress', 'planned'].includes(item.implementation.state) ||
                                Object.keys(item.implementation).length !== 1
                            ) {
                                fail(
                                    component.file,
                                    node,
                                    `Invalid planned wrapper state for ${item.name}.`,
                                );
                            }
                            const owner = implemented
                                ? group.components.find(
                                      (entry) =>
                                          entry.implementation.export ===
                                          item.implementation.demoOwner,
                                  )
                                : null;
                            if (
                                implemented &&
                                (!owner ||
                                    owner.implementation.state !== 'implemented' ||
                                    owner.implementation.demoOwner !== owner.implementation.export)
                            ) {
                                fail(component.file, node, `Invalid demo owner for ${item.name}.`);
                            }
                            append([
                                item.name,
                                catalog().statuses[item.implementation.state].label,
                                item.help,
                                item.tag,
                                item.edition,
                                item.since ? `Since ${item.since}` : null,
                                `Reviewed baseline ${catalog().coreBaseline}`,
                                item.availability,
                                implemented
                                    ? 'Basic example'
                                    : catalog().statuses[item.implementation.state].description,
                                implemented &&
                                !(
                                    item.implementation.guide ===
                                        `front-awesome/web-awesome/components/${group.id}` &&
                                    item.implementation.guideFragment ===
                                        `#${item.implementation.anchor}`
                                )
                                    ? 'Full guide'
                                    : null,
                                'Web Awesome reference',
                                owner && owner !== item
                                    ? `Used with ${owner.name}. Their shared example includes this public wrapper. Example with ${owner.name}`
                                    : null,
                            ]);
                        }
                    }
                    continue;
                }
                if (node.tag === 'slot') {
                    const name = attribute(node, 'name', scope, component, 'default');
                    const slot = scope.slots.get(name);
                    if (slot) {
                        if (slot.scoped)
                            fail(
                                component.file,
                                node,
                                'Searchable authored slots must not depend on runtime slot props.',
                            );
                        visit(slot.nodes, slot.scope, slot.component, slot.stack);
                    } else visit(node.children, scope, component, stack);
                    continue;
                }
                if (/^h[2-6]$/u.test(node.tag)) {
                    heading(
                        text(node.children, scope, component),
                        attribute(node, 'id', scope, component),
                        component,
                        node,
                    );
                    continue;
                }
                if (name === 'ProseSection' || name === 'Requirements') {
                    const title = attribute(
                        node,
                        'title',
                        scope,
                        component,
                        name === 'Requirements' ? 'Requirements' : null,
                    );
                    if (title)
                        heading(
                            title,
                            attribute(
                                node,
                                'id',
                                scope,
                                component,
                                name === 'Requirements' ? 'requirements' : null,
                            ),
                            component,
                            node,
                        );
                    visit(node.children, scope, component, stack);
                    if (name === 'Requirements')
                        append(attribute(node, 'items', scope, component, []));
                    continue;
                }
                if (name === 'InstallCommand') {
                    const metadata = attribute(node, 'package', scope, component);
                    const key = attribute(node, 'command', scope, component, 'composer');
                    const instruction = metadata?.installationCommands?.[key];
                    if (!instruction || !Object.hasOwn(instruction, 'code'))
                        fail(component.file, node, `Unknown installation command ${key}.`);
                    if (instruction.code) {
                        append(attribute(node, 'label', scope, component));
                        append(instruction.code);
                        visit(node.children, scope, component, stack);
                    } else {
                        append(
                            'Installation command unavailable. The documentation has no locked version for a required dependency.',
                        );
                    }
                    continue;
                }
                if (name === 'CodeExample') {
                    const code = attribute(node, 'code', scope, component);
                    if (typeof code !== 'string')
                        fail(
                            component.file,
                            node,
                            'CodeExample requires a static string for search.',
                        );
                    append(attribute(node, 'label', scope, component));
                    append(code);
                    visit(node.children, scope, component, stack);
                    continue;
                }
                if (name === 'DocsTable') {
                    append(attribute(node, 'caption', scope, component));
                    const rows = attribute(node, 'rows', scope, component);
                    if (rows !== null) {
                        append(attribute(node, 'columns', scope, component, []));
                        append(rows);
                    } else visit(node.children, scope, component, stack);
                    continue;
                }
                if (['DocsLink', 'DocsCallout'].includes(name)) {
                    visit(node.children, scope, component, stack);
                    continue;
                }
                if (imported?.endsWith('.vue')) {
                    const props = Object.create(null);
                    for (const property of node.props) {
                        if (property.type === NodeType.attribute)
                            props[propName(property.name)] = property.value?.content ?? '';
                        if (
                            property.type === NodeType.directive &&
                            property.name === 'bind' &&
                            property.arg?.isStatic
                        ) {
                            const key = propName(property.arg.content);
                            Object.defineProperty(props, key, {
                                enumerable: true,
                                get: () =>
                                    expression(property.exp.content, scope, component, property),
                            });
                        }
                    }
                    const target = imported.startsWith('@/')
                        ? resolve(sourceRoot, imported.slice(2))
                        : resolve(dirname(component.file), imported);
                    const slots = new Map();
                    const directSlot = node.props.find(
                        (item) => item.type === NodeType.directive && item.name === 'slot',
                    );
                    if (directSlot?.arg && !directSlot.arg.isStatic)
                        fail(component.file, node, 'Searchable slot names must be static.');
                    const defaultNodes = [];
                    for (const child of node.children) {
                        const slot =
                            child.type === NodeType.element &&
                            child.props.find(
                                (item) => item.type === NodeType.directive && item.name === 'slot',
                            );
                        if (slot) {
                            if (slot.arg && !slot.arg.isStatic)
                                fail(
                                    component.file,
                                    child,
                                    'Searchable slot names must be static.',
                                );
                            slots.set(slot.arg?.content ?? 'default', {
                                nodes: child.children,
                                scope,
                                component,
                                stack,
                                scoped: Boolean(slot.exp),
                            });
                        } else defaultNodes.push(child);
                    }
                    if (
                        defaultNodes.some(
                            (child) => child.type !== NodeType.text || child.content.trim(),
                        )
                    ) {
                        slots.set(directSlot?.arg?.content ?? 'default', {
                            nodes: defaultNodes,
                            scope,
                            component,
                            stack,
                            scoped: Boolean(directSlot?.exp),
                        });
                    }
                    visitComponent(target, props, stack, slots);
                    continue;
                }
                if (node.tagType === 1)
                    fail(
                        component.file,
                        node,
                        `Unsupported searchable component ${node.tag}. Use an authored Vue partial or add its shared content adapter.`,
                    );
                visit(node.children, scope, component, stack);
            }
        }
        const props = {
            page: {
                ...page,
                requirements: page.requirements,
                package: page.package ?? { title: page.packageTitle },
            },
            requirements: page.requirements,
        };
        visitComponent(resolve(root, page.sourcePath), props, []);
        for (const target of catalogTargets) {
            if (!anchors.has(target))
                throw new Error(
                    `${page.sourcePath}: Missing catalog implementation section ${target}.`,
                );
        }
        flush();
        documents.push(...pageDocuments);
    }
    return documents;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        let input = '';
        for await (const chunk of process.stdin) input += chunk;
        const documents = extractDocumentation(JSON.parse(input));
        process.stdout.write(JSON.stringify(documents));
    } catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.exitCode = 1;
    }
}

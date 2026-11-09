import { createRequire } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const workspace = fileURLToPath(new URL('../../', import.meta.url));
const legacyRoot = path.join(workspace, 'docs_old/src/content/docs');
const legacyRequire = createRequire(path.join(workspace, 'docs_old/package.json'));
const loadLegacy = (name) => import(pathToFileURL(legacyRequire.resolve(name)).href);
const [
    { fromMarkdown },
    { directive },
    { directiveFromMarkdown },
    { default: Slugger },
    { parse: parseYaml },
] = await Promise.all([
    loadLegacy('mdast-util-from-markdown'),
    loadLegacy('micromark-extension-directive'),
    loadLegacy('mdast-util-directive'),
    loadLegacy('github-slugger'),
    loadLegacy('yaml'),
]);
const aliases = {
    'maintainer/project-integration': 'maintainer/versioning/project-integration',
    'qztray/v1-readiness': 'qztray/compatibility',
};

export function legacySourceSlugs(directory = path.join(legacyRoot, 'packages')) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) return legacySourceSlugs(filename);
        if (!entry.name.endsWith('.md')) return [];
        return [
            path
                .relative(path.join(legacyRoot, 'packages'), filename)
                .replace(/\.md$/, '')
                .replace(/\/index$/, ''),
        ];
    });
}

export function resolveLegacyLink(destination, legacyPath) {
    if (destination.startsWith('#')) return { href: destination };
    const base = new URL(`https://atb.dev.br/${legacyPath.replace(/\/index$/, '')}/`);
    const url = new URL(destination, base);
    if (url.origin !== base.origin || !url.pathname.startsWith('/packages/'))
        return { href: destination };
    let slug = url.pathname
        .replace(/^\/packages\//, '')
        .replace(/\/$/, '')
        .replace(/\/index$/, '');
    slug = aliases[slug] ?? slug;
    if (!legacySourceSlugs().includes(slug)) return { href: url.href };
    return { slug, hash: url.hash, href: `/docs/${slug}${url.hash}` };
}

export function readLegacyDocument(legacyPath) {
    const filename = path.join(legacyRoot, `${legacyPath}.md`);
    const source = readFileSync(filename, 'utf8');
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const metadata = frontmatter ? parseYaml(frontmatter[1]) : {};
    const markdown = source.slice(frontmatter?.[0].length ?? 0);
    const tree = fromMarkdown(markdown, {
        extensions: [directive()],
        mdastExtensions: [directiveFromMarkdown()],
    });
    const slugger = new Slugger();
    const headings = [];
    const examples = [];
    const links = [];
    const anchors = [];
    const walk = (node) => {
        if (node.type === 'heading') {
            node.headingId = slugger.slug(plainText(node));
            headings.push({
                level: node.depth,
                id: node.headingId,
                text: plainText(node),
            });
        }
        if (node.type === 'code')
            examples.push({
                code: node.value,
                language: node.lang ?? 'text',
                meta: node.meta,
            });
        if (node.type === 'link') links.push(resolveLegacyLink(node.url, legacyPath));
        if (node.type === 'html') {
            for (const match of node.value.matchAll(/\bid=["']([^"']+)["']/g))
                anchors.push(match[1]);
        }
        for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
    return {
        legacyPath,
        metadata,
        markdown,
        tree,
        headings,
        examples,
        links,
        anchors,
    };
}

export function plainText(node) {
    return node.value ?? (node.children ?? []).map(plainText).join('');
}

const escapeText = (value) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('{', '&#123;')
        .replaceAll('}', '&#125;');
const attribute = (value) => escapeText(value).replaceAll('"', '&quot;');
const literal = (value) =>
    '`' +
    value
        .replaceAll('\\', '\\\\')
        .replaceAll('`', '\\`')
        .replaceAll('${', '\\${')
        .replaceAll('</script', '\\x3C/script') +
    '`';

function tableCells(line) {
    const result = [];
    let cell = '';
    let ticks = false;
    for (const character of line.trim().replace(/^\|/, '').replace(/\|$/, '')) {
        if (character === '`') ticks = !ticks;
        if (character === '|' && !ticks && !cell.endsWith('\\')) {
            result.push(cell.trim());
            cell = '';
        } else cell += character;
    }
    result.push(cell.trim());
    return result;
}

export function renderLegacyDocument(document, nodes = document.tree.children) {
    const imports = new Set(['ProseSection']);
    const declarations = [];
    let exampleIndex = 0;
    let tableIndex = 0;
    let currentHeading = document.metadata.title;
    const inline = (value) => fromMarkdown(value).children.map(render).join('');
    function render(node) {
        const children = () => (node.children ?? []).map(render).join('');
        switch (node.type) {
            case 'text':
                return escapeText(node.value);
            case 'inlineCode':
                return `<code>${escapeText(node.value)}</code>`;
            case 'strong':
                return `<strong>${children()}</strong>`;
            case 'emphasis':
                return `<em>${children()}</em>`;
            case 'delete':
                return `<del>${children()}</del>`;
            case 'break':
                return '<br />';
            case 'html':
                return node.value;
            case 'link': {
                imports.add('DocsLink');
                const link = resolveLegacyLink(node.url, document.legacyPath);
                const href = link.slug
                    ? `:href="findNavigationItem(navigation, '${link.slug}').href${link.hash ? ` + '${link.hash}'` : ''}"`
                    : `href="${attribute(link.href)}"`;
                return `<DocsLink ${href}${node.title ? ` title="${attribute(node.title)}"` : ''}>${children()}</DocsLink>`;
            }
            case 'image':
                return `<img src="${attribute(node.url)}" alt="${attribute(node.alt ?? '')}"${node.title ? ` title="${attribute(node.title)}"` : ''} />`;
            case 'paragraph': {
                const raw = document.markdown.slice(
                    node.position.start.offset,
                    node.position.end.offset,
                );
                const lines = raw.split('\n');
                if (/^\s*\|/.test(lines[0]) && /^\s*\|?[\s:|-]+\|\s*$/.test(lines[1] ?? '')) {
                    imports.add('DocsTable');
                    tableIndex += 1;
                    const rows = lines.filter((_, index) => index !== 1).map(tableCells);
                    return `<DocsTable caption="${attribute(`${currentHeading} reference ${tableIndex}`)}"><thead><tr>${rows[0].map((cell) => `<th scope="col">${inline(cell).replace(/^<p>|<\/p>$/g, '')}</th>`).join('')}</tr></thead><tbody>${rows
                        .slice(1)
                        .map(
                            (row) =>
                                `<tr>${row.map((cell) => `<td>${inline(cell).replace(/^<p>|<\/p>$/g, '')}</td>`).join('')}</tr>`,
                        )
                        .join('')}</tbody></DocsTable>`;
                }
                return `<p>${children()}</p>`;
            }
            case 'heading': {
                currentHeading = plainText(node);
                return `<h${node.depth} id="${node.headingId}" class="scroll-mt-28 ${node.depth === 2 ? 'text-2xl' : 'text-xl'} font-semibold tracking-tight text-slate-950 dark:text-white">${children()}</h${node.depth}>`;
            }
            case 'list':
                return `<${node.ordered ? 'ol' : 'ul'}${node.ordered ? ` class="list-decimal pl-5"${node.start !== 1 ? ` start="${node.start}"` : ''}` : ''}>${children()}</${node.ordered ? 'ol' : 'ul'}>`;
            case 'listItem':
                return `<li>${children()}</li>`;
            case 'blockquote':
                return `<blockquote class="border-l-4 border-slate-300 pl-5 dark:border-slate-700">${children()}</blockquote>`;
            case 'thematicBreak':
                return '<hr class="border-slate-200 dark:border-slate-800" />';
            case 'code': {
                imports.add('CodeExample');
                const name = `example${++exampleIndex}`;
                const title =
                    node.meta?.match(/title=["']([^"']+)["']/)?.[1] ??
                    `${currentHeading} example ${exampleIndex}`;
                declarations.push(`const ${name} = ${literal(node.value)};`);
                return `<CodeExample label="${attribute(title)}" language="${attribute(node.lang ?? 'text')}" :code="${name}" />`;
            }
            case 'containerDirective': {
                imports.add('DocsCallout');
                const variant = ['note', 'tip', 'caution', 'danger', 'info'].includes(node.name)
                    ? node.name
                    : 'note';
                const label = node.children?.[0]?.data?.directiveLabel ? node.children[0] : null;
                const body = (label ? node.children.slice(1) : node.children).map(render).join('');
                return `<DocsCallout variant="${variant}">${label ? `<template #title>${render(label).replace(/^<p>|<\/p>$/g, '')}</template>` : ''}${body}</DocsCallout>`;
            }
            default:
                throw new Error(`Unsupported Markdown node ${node.type} in ${document.legacyPath}`);
        }
    }
    const template = `<ProseSection>\n${nodes.map(render).join('\n')}\n</ProseSection>`;
    const importSource = [...imports]
        .sort()
        .map((name) => `import ${name} from '@/components/docs/${name}.vue';`)
        .join('\n');
    return {
        template,
        declarations: declarations.join('\n'),
        imports: importSource,
    };
}

export function vueContentSource(document, nodes = document.tree.children) {
    const content = renderLegacyDocument(document, nodes);
    return `<script setup>\n${content.imports}\n${content.template.includes('findNavigationItem(') ? "import { findNavigationItem } from '@/lib/docsNavigation';\n" : ''}defineProps({ navigation: { type: Array, required: true } });\n${content.declarations}\n</script>\n\n<template>\n${content.template}\n</template>\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const legacyPath = process.argv[2];
    if (!legacyPath) {
        throw new Error(
            'Pass a source path such as packages/core/index. The command prints editable Vue source.',
        );
    }
    process.stdout.write(vueContentSource(readLegacyDocument(legacyPath)));
}

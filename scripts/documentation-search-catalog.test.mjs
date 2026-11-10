import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { extractDocumentation } from './documentation-search.mjs';

const catalogPath = 'resources/js/components/docs/front-awesome/catalog/components.json';
const canonicalCatalog = JSON.parse(readFileSync(resolve(process.cwd(), catalogPath), 'utf8'));
const mixedStatusCatalog = structuredClone(canonicalCatalog);
const fixtureExports = new Set([
    'Button',
    'ButtonGroup',
    'Input',
    'Page',
    'Tag',
    'Tooltip',
    'Icon',
    'Popover',
]);
for (const group of mixedStatusCatalog.groups) {
    for (const component of group.components) {
        if (!fixtureExports.has(component.implementation.export))
            component.implementation = { state: 'planned' };
    }
}
const temporaryRoots = [];
afterEach(() => {
    for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});
function fixture({
    group = 'actions',
    sections = '<h2 id="button">Button</h2><p>Basic action example.</p><h2 id="button-group">Button Group</h2>',
    overview = false,
    catalog = mixedStatusCatalog,
    directive = '',
    importPath = '@/components/docs/front-awesome/catalog/ComponentCatalog.vue',
} = {}) {
    const root = mkdtempSync(resolve(tmpdir(), 'atb-catalog-search-'));
    temporaryRoots.push(root);
    const sourcePath = 'resources/js/pages/docs/Fixture.vue';
    const write = (path, content) => {
        mkdirSync(resolve(root, path, '..'), { recursive: true });
        writeFileSync(resolve(root, path), content);
    };
    write(catalogPath, JSON.stringify(catalog));
    write(
        sourcePath,
        `<script setup>import Catalog from '${overview ? '@/components/docs/front-awesome/catalog/CatalogOverview.vue' : importPath}';</script><template><h2 id="components">Component status</h2><Catalog group="${group}" ${directive} />${sections}</template>`,
    );
    const page = {
        slug: 'fixture',
        title: 'Fixture',
        description: 'Catalog.',
        packageTitle: 'Front Awesome',
        sourcePath,
    };
    return { extract: () => extractDocumentation([page], { root }), write };
}

describe('catalog semantic search adapter', () => {
    it('indexes visible names, statuses, help, tags, and editions from the same JSON as runtime tags', () => {
        const catalog = structuredClone(mixedStatusCatalog);
        catalog.groups[0].components[0].help = 'A changed purpose from the shared catalog.';
        const result = fixture({ catalog }).extract();
        const cards = result.find((document) => document.anchor === 'components');
        expect(cards.body).toContain(
            'Button Implemented A changed purpose from the shared catalog. wa-button Core',
        );
        expect(cards.body).toContain('Copy Button In future');
        expect(cards.body).toContain('Reviewed baseline 3.14.0');
        expect(cards.body).toContain('Basic example Web Awesome reference');
        expect(cards.body).toContain('This Vue wrapper is planned.');
        expect(result.find((document) => document.anchor === 'button').body).toBe(
            'Basic action example.',
        );
        expect(result.map((document) => document.anchor)).toEqual([
            null,
            'components',
            'button',
            'button-group',
        ]);
    });

    it('resolves a relative import with a local component alias to the same semantic adapter', () => {
        const result = fixture({
            importPath: '../../components/docs/front-awesome/catalog/ComponentCatalog.vue',
        }).extract();
        expect(result.find((document) => document.anchor === 'components').body).toContain(
            'Copy Button In future',
        );
    });

    it('indexes overview group descriptions and counts from that same data', () => {
        const result = fixture({ overview: true, sections: '' }).extract();
        const body = result.find((document) => document.anchor === 'components').body;
        expect(body).toContain(
            'Actions Trigger an action or group related controls. 2 implemented · 0 in progress · 3 in future',
        );
        expect(body).toContain(
            'Data Viz Present structured data and chart series. 0 implemented · 0 in progress · 11 in future',
        );
    });

    it('uses shared state labels and counts without treating work in progress as planned', () => {
        const catalog = structuredClone(mixedStatusCatalog);
        catalog.statuses['in-progress'].label = 'Work underway';
        catalog.statuses['in-progress'].countLabel = 'underway';
        catalog.groups[0].components[2].implementation = {
            state: 'in-progress',
        };
        const result = fixture({ catalog }).extract();
        expect(result[1].body).toContain('Copy Button Work underway');
        const overview = fixture({
            catalog,
            overview: true,
            sections: '',
        }).extract();
        expect(overview[1].body).toContain('2 implemented · 1 underway · 2 in future');
        expect(result.map((document) => document.anchor)).not.toContain('copy-button');
    });

    it('includes Pro Chart and the newer experimental Code Highlighter without invented example anchors', () => {
        const pro = fixture({ group: 'data-viz', sections: '' }).extract();
        expect(pro[1].body).toContain(
            'Chart In future Configure chart types, datasets, and plugins. wa-chart Pro Since 3.3',
        );
        const media = fixture({
            group: 'media',
            sections: '<h2 id="icon">Icon</h2>',
        }).extract();
        expect(media[1].body).toContain('Code Highlighter In future');
        expect(media[1].body).toContain(
            'Since 3.15 Reviewed baseline 3.14.0 Experimental; newer than the Core 3.14.0 baseline.',
        );
        expect(pro.map((document) => document.anchor)).toEqual([null, 'components']);
    });

    it('rejects missing and duplicate implementation sections', () => {
        expect(fixture({ sections: '<h2 id="button">Button</h2>' }).extract).toThrow(
            'Missing catalog implementation section button-group',
        );
        expect(
            fixture({
                sections: '<h2 id="button">Button</h2><h2 id="button">Duplicate</h2>',
            }).extract,
        ).toThrow('Duplicate search anchor button');
    });

    it('rejects unknown groups, phantom planned destinations, and runtime directives', () => {
        const invalidOwner = structuredClone(mixedStatusCatalog);
        invalidOwner.groups[0].components[0].implementation.demoOwner = 'Missing';
        expect(fixture({ catalog: invalidOwner }).extract).toThrow('Invalid demo owner for Button');
        expect(fixture({ group: 'unknown' }).extract).toThrow(
            'Unknown component catalog group unknown',
        );
        const catalog = structuredClone(mixedStatusCatalog);
        catalog.groups[0].components[2].implementation.anchor = 'phantom';
        expect(fixture({ catalog }).extract).toThrow(
            'Invalid planned wrapper state for Copy Button',
        );
        expect(fixture({ directive: 'v-if="available"' }).extract).toThrow(
            'Searchable prose must not depend on runtime directives',
        );
    });

    it('extracts the real overview and eight group pages with unique, rendered section destinations', () => {
        const components = [
            'Index',
            'Actions',
            'Forms',
            'Layout',
            'Navigation',
            'Feedback',
            'Media',
            'DataViz',
            'Helpers',
        ];
        const pages = components.map((component) => ({
            slug: `catalog/${component}`,
            title: component,
            description: 'Component catalog.',
            packageTitle: 'Front Awesome',
            sourcePath: `resources/js/pages/docs/front-awesome/web-awesome/components/${component}.vue`,
        }));
        const result = extractDocumentation(pages);
        expect(
            result.find(
                (document) => document.slug === 'catalog/Actions' && document.anchor === 'button',
            ).body,
        ).toContain('<script setup>');
        expect(
            result.find(
                (document) =>
                    document.slug === 'catalog/Forms' && document.anchor === 'use-v-model',
            ).body,
        ).toContain('v-model="name"');
        expect(
            result.find(
                (document) =>
                    document.slug === 'catalog/Media' && document.anchor === 'render-an-icon',
            ).body,
        ).toContain('name="download"');
        expect(
            result.find(
                (document) => document.slug === 'catalog/Helpers' && document.anchor === 'popover',
            ).body,
        ).toContain('data-popover="close"');
        expect(
            result.find(
                (document) =>
                    document.slug === 'catalog/Helpers' && document.anchor === 'components',
            ).body,
        ).toContain('Popover Implemented');
        const section = (slug, anchor) =>
            result.find((document) => document.slug === slug && document.anchor === anchor)?.body;
        expect(section('catalog/Forms', 'bind-an-inertia-form')).toContain('users.0.email');
        expect(section('catalog/Forms', 'reuse-the-bridge')).toContain('useFormBridge');
        expect(section('catalog/Forms', 'display-server-errors')).toContain('setCustomValidity()');
        expect(section('catalog/Forms', 'option')).toContain('Select');
        expect(section('catalog/Forms', 'option')).toContain('Combobox');
        expect(section('catalog/Navigation', 'tab-panel')).toContain('TabPanel');
        expect(section('catalog/Navigation', 'tab-panel')).toContain('TabGroup');
        expect(section('catalog/Forms', 'components')).toContain('Used with Select.');
        for (const page of pages) {
            const documents = result.filter((document) => document.slug === page.slug);
            expect(new Set(documents.map((document) => document.anchor)).size).toBe(
                documents.length,
            );
        }
    });
});

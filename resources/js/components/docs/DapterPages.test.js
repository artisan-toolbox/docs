import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/dapter/Index.vue';
import FieldSearch from '../../pages/docs/dapter/FieldSearch.vue';
import FieldFilters from '../../pages/docs/dapter/FieldFilters.vue';
import FieldOrder from '../../pages/docs/dapter/FieldOrder.vue';
import Installation from '../../pages/docs/dapter/Installation.vue';
import Listing from '../../pages/docs/dapter/Listing.vue';
import CodeExample from './CodeExample.vue';
import Development from '../../pages/docs/dapter/Development.vue';
import Roadmap from '../../pages/docs/dapter/Roadmap.vue';
import Design from '../../pages/docs/dapter/Design.vue';
import Declarations from '../../pages/docs/dapter/design/Declarations.vue';
import Drivers from '../../pages/docs/dapter/design/Drivers.vue';
import SourceBoundaries from '../../pages/docs/dapter/design/SourceBoundaries.vue';
import Operations from '../../pages/docs/dapter/design/Operations.vue';
import PagingState from '../../pages/docs/dapter/design/PagingState.vue';
import Actions from '../../pages/docs/dapter/design/Actions.vue';
import { productDefinition } from '../../pages/docs/dapter/design/reference/operations';
import operationReference from '../../pages/docs/dapter/design/reference/operations.ts?raw';
import queryReference from '../../pages/docs/dapter/design/reference/query.ts?raw';
import LiveUpdates from '../../pages/docs/dapter/design/LiveUpdates.vue';
import RoadmapItem from './RoadmapItem.vue';
import RoadmapPhase from './RoadmapPhase.vue';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import { sourceNavigation } from './sourceNavigationFixture';
import { installationCommands } from './installationFixture';
import { findNavigationItem } from '../../lib/docsNavigation';

const proposalGuides = [
    ['Declarations', 'declarations', Declarations],
    ['SourceBoundaries', 'source-boundaries', SourceBoundaries],
    ['Drivers', 'drivers', Drivers],
    ['Operations', 'operations', Operations],
    ['PagingState', 'paging-state', PagingState],
    ['Actions', 'actions', Actions],
    ['LiveUpdates', 'live-updates', LiveUpdates],
];

function renderProposal() {
    return render(
        defineComponent({
            props: ['page', 'navigation'],
            setup: (props) => () =>
                h('div', [
                    h(Roadmap, props),
                    ...proposalGuides.map(([, slug, component]) =>
                        h(component, {
                            ...props,
                            page: { ...props.page, slug: `dapter/design/${slug}` },
                        }),
                    ),
                ]),
        }),
        'dapter/roadmap',
    );
}

function extractProposalDocumentation() {
    return extractDocumentation([
        {
            slug: 'dapter/roadmap',
            title: 'Dapter roadmap',
            description: 'Delivery phases and acceptance gates.',
            packageTitle: 'Dapter',
            sourcePath: 'resources/js/pages/docs/dapter/Roadmap.vue',
        },
        ...proposalGuides.map(([name, slug]) => ({
            slug: `dapter/design/${slug}`,
            title: `Dapter ${slug} design`,
            description: 'Proposed contracts for the unpublished preview.',
            packageTitle: 'Dapter',
            sourcePath: `resources/js/pages/docs/dapter/design/${name}.vue`,
        })),
    ]);
}

function render(component, slug) {
    return mount(component, {
        props: {
            page: {
                slug,
                title: findNavigationItem(sourceNavigation(), slug).title,
                description: 'Read Laravel data with Dapter.',
                requirements: ['PHP ^8.5', 'Laravel 13', 'Inertia 3', 'Node.js >=24.11.0'],
                package: {
                    id: 'dapter',
                    title: 'Dapter',
                    composerName: 'artisan-toolbox/dapter',
                    stability: 'Beta',
                    installedVersion: '1.0.0-beta.3',
                    installationStatus: 'installed',
                    installationCommands: installationCommands('dapter'),
                    artwork: { icon: '/images/packages/dapter/dapter-icon.svg' },
                },
            },
            navigation: sourceNavigation(),
        },
    });
}

describe('Dapter learning journey', () => {
    it.each([
        ['Load the source asynchronously', Index, 'dapter'],
        ['Bind the authorized field in Vue', FieldSearch, 'dapter/field-search'],
        ['Bind the authorized field in Vue', FieldFilters, 'dapter/field-filters'],
        ['Bind the authorized field in Vue', FieldOrder, 'dapter/field-order'],
        ['Source-only Vue adapter', Listing, 'dapter/listing'],
        [
            'Shared host handle and independent second adapter',
            PagingState,
            'dapter/design/paging-state',
        ],
    ])('compiles the minimal Vue source displayed by %s', (label, component, slug) => {
        const wrapper = render(component, slug);
        const example = wrapper
            .findAllComponents(CodeExample)
            .find((item) => item.props('label') === label);
        expect(example, label).toBeDefined();
        const code = example.props('code');
        const { descriptor, errors } = parse(code);
        expect(errors, label).toEqual([]);
        expect(descriptor.scriptSetup, label).not.toBeNull();
        expect(descriptor.template, label).not.toBeNull();
        const script = compileScript(descriptor, { id: slug });
        const template = compileTemplate({
            id: slug,
            source: descriptor.template.content,
            filename: `${slug}.vue`,
            compilerOptions: { bindingMetadata: script.bindings },
        });
        expect(template.errors, label).toEqual([]);
        wrapper.unmount();
    });

    it('introduces the published beta with a runnable notebook list and registry guide links', () => {
        const wrapper = render(Index, 'dapter');
        expect(wrapper.text()).toContain(installationCommands('dapter').composer.code);
        expect(wrapper.text()).toContain('ordinary SQLite');
        expect(wrapper.text()).toContain('Beta');
        expect(wrapper.get('a[href="/docs/dapter/installation"]').text()).toContain('Install');
        const quickstart = wrapper.get('section[aria-labelledby="first-example"]');
        expect(quickstart.text()).toContain('Notebook 01 through Notebook 10');
        expect(quickstart.find('[data-quickstart-usage]').exists()).toBe(true);
        const guides = findNavigationItem(sourceNavigation(), 'dapter').children;
        expect(
            wrapper
                .get('nav[aria-label="Dapter guides"]')
                .findAll('a')
                .map((item) => item.attributes('href')),
        ).toEqual(guides.map((guide) => guide.href));
        wrapper.unmount();
    });

    it('places requirements and Composer before frontend installation with observable results', () => {
        const wrapper = render(Installation, 'dapter/installation');
        const text = wrapper.text();
        expect(text.indexOf('PHP ^8.5')).toBeLessThan(text.indexOf('composer require'));
        expect(text.indexOf('composer require')).toBeLessThan(text.indexOf('npm install'));
        expect(text).toContain(installationCommands('dapter').composer.code);
        expect(text).not.toContain('composer config repositories.dapter');
        expect(text).toContain('file:vendor/artisan-toolbox/dapter');
        expect(text).toContain('data-dapter-version');
        expect(wrapper.get('section[aria-labelledby="read-route"]').text()).toContain(
            "route().has('dapter.data')",
        );
        expect(wrapper.get('section[aria-labelledby="next-steps"] a').attributes('href')).toBe(
            '/docs/dapter#first-example',
        );
        expect(text).toContain('1.0.0-beta.3');
        wrapper.unmount();
    });

    it('documents the actual checks and separates direct npm minima from transitive dependencies', () => {
        const wrapper = render(Development, 'dapter/development');
        expect(wrapper.text()).toContain('composer quality:check');
        expect(wrapper.text()).toContain('npm run release:build');
        expect(wrapper.text()).toContain('NodeNext');
        expect(wrapper.text()).toContain('does not claim a transitive npm dependency minimum');
        const phpstan = wrapper.get('section[aria-labelledby="phpstan"]');
        expect(phpstan.text()).toContain('PHPStan 2.3');
        expect(phpstan.text()).toContain('phpstan/extension-installer');
        expect(phpstan.text()).toContain('PHPStan rejects duplicate includes');
        expect(phpstan.text()).toContain('vendor/artisan-toolbox/dapter/extension.neon');
        expect(phpstan.text()).toContain('Action');
        expect(phpstan.text()).toContain('GlobalFilter');
        expect(phpstan.text()).toContain('GlobalOrder');
        expect(phpstan.text()).toContain('Ordinary unused private helpers still report');
        expect(wrapper.text()).toContain('Page.rescuedProps');
        expect(wrapper.text()).toContain('InertiaConfig augmentation');
        wrapper.unmount();
    });
});

describe('Dapter delivered contract documentation', () => {
    it('indexes preset invariants and the native action resolver limits from working guides', () => {
        const documents = extractDocumentation([
            {
                slug: 'dapter/multi-order',
                title: 'Order multiple fields',
                description: 'Unpublished preview.',
                packageTitle: 'Dapter',
                sourcePath: 'resources/js/pages/docs/dapter/MultiOrder.vue',
            },
            {
                slug: 'dapter/action-outcomes',
                title: 'Handle action outcomes',
                description: 'Unpublished preview.',
                packageTitle: 'Dapter',
                sourcePath: 'resources/js/pages/docs/dapter/ActionOutcomes.vue',
            },
        ]);
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;
        expect(body('presets')).toContain('cannot remove, duplicate, restore, or replace its rows');
        expect(body('presets')).toContain('qualified model key');
        expect(body('presets')).toContain('duplicate multiplicity');
        expect(body('presets')).toContain('never performs a second Collection sort');
        expect(body('options')).toContain('conservative baseline');
        expect(body('options')).toContain('Inertia 3.0.3');
        expect(body('options')).toContain('Page.rescuedProps');
        expect(body('options')).toContain('InertiaConfig augmentation');
        expect(body('options')).toContain('actual native objects');
    });
});

describe('Dapter proposal roadmap', () => {
    it('records current server authority as complete while retaining later operation obligations', () => {
        const wrapper = render(Roadmap, 'dapter/roadmap');
        const authority = wrapper
            .findAllComponents(RoadmapItem)
            .find((item) => item.props('id') === 'todo-0-1');
        expect(authority.props('status')).toBe('completed');
        expect(authority.text()).toContain('current Collection and ordinary SQLite offset preview');
        expect(authority.text()).toContain('Every fluent capability has an attribute shortcut');
        expect(authority.text()).toContain(
            'Each later operation phase must preserve this contract',
        );
        expect(authority.get('a[href="/docs/dapter/authority"]').text()).toBe(
            'server authority guide',
        );
        wrapper.unmount();
    });
    it('keeps delivery progress on the roadmap and routes readers to focused design pages', () => {
        const wrapper = render(Roadmap, 'dapter/roadmap');
        expect(wrapper.findAllComponents(RoadmapItem)).toHaveLength(61);
        expect(wrapper.findAllComponents(RoadmapPhase)).toHaveLength(10);
        expect(wrapper.get('a[href="/docs/dapter/design"]').text()).toContain('proposed design');
        for (const anchor of [
            'ownership-and-reusable-contracts',
            'store-drivers-and-capabilities',
            'scope-filters-and-search',
            'vue-slot-and-action-contract',
            'datastore-actions',
            'async-requests-url-and-scrolling',
        ]) {
            expect(wrapper.find(`h2[id="${anchor}"]`).exists()).toBe(false);
        }
        wrapper.unmount();

        const landing = render(Design, 'dapter/design');
        const links = landing.get('nav[aria-label="Proposed design guides"]').findAll('a');
        expect(links.map((link) => link.attributes('href'))).toEqual([
            ...proposalGuides.map(([, slug]) => `/docs/dapter/design/${slug}`),
            '/docs/dapter/design/fixtures',
        ]);
        expect(landing.text()).toContain('They are not installation instructions.');
        landing.unmount();
    });

    it.each(proposalGuides)(
        'renders the %s design as a bounded proposal with shared guide presentation',
        (_, slug, component) => {
            const wrapper = render(component, `dapter/design/${slug}`);
            expect(wrapper.findAll('h1')).toHaveLength(1);
            expect(wrapper.get('h1').text()).toBe(
                findNavigationItem(sourceNavigation(), `dapter/design/${slug}`).title,
            );
            const sectionAnchors = {
                declarations: ['implemented-preview', 'ownership-and-reusable-contracts'],
                'source-boundaries': ['distinct-identities', 'planned-response-metadata'],
                drivers: [
                    'implemented-preview',
                    'store-drivers-and-capabilities',
                    'source-resolution-and-automatic-behavior',
                    'capability-rollout',
                ],
                operations: [
                    'implemented-preview',
                    'six-operation-contract-cases',
                    'scope-filters-and-search',
                    'sorting-and-complex-queries',
                ],
                'paging-state': ['pagination-and-consistency', 'vue-slot-and-action-contract'],
                actions: ['implemented-preview', 'datastore-actions'],
                'live-updates': ['async-requests-url-and-scrolling'],
            };
            expect(wrapper.findAll('h2').map((heading) => heading.attributes('id'))).toEqual(
                sectionAnchors[slug],
            );
            expect(wrapper.findAllComponents(RoadmapPhase)).toHaveLength(0);
            if (slug === 'live-updates') {
                expect(wrapper.text()).toContain(
                    'Historical design for the unpublished Dapter preview.',
                );
                expect(wrapper.text()).toContain(
                    'focused live authorization, committed replacement, revision race, and polling working guides',
                );
            } else {
                expect(wrapper.text()).toContain(
                    'Design proposal for the unpublished Dapter preview.',
                );
                expect(wrapper.text()).toContain('these examples are unavailable');
            }
            expect(wrapper.get('a[href="/docs/dapter/listing"]').text()).toBe(
                'functional listing guide',
            );
            expect(wrapper.get('a[href="/docs/dapter/roadmap"]').text()).toBe('roadmap');
            wrapper.unmount();
        },
    );

    it('indexes moved contract anchors under their owning design guide once', () => {
        const documents = extractProposalDocumentation();
        for (const [anchor, slug] of [
            ['ownership-and-reusable-contracts', 'declarations'],
            ['store-drivers-and-capabilities', 'drivers'],
            ['source-resolution-and-automatic-behavior', 'drivers'],
            ['scope-filters-and-search', 'operations'],
            ['sorting-and-complex-queries', 'operations'],
            ['pagination-and-consistency', 'paging-state'],
            ['competitor-state-research', 'paging-state'],
            ['datastore-actions', 'actions'],
            ['broadcast-updates', 'live-updates'],
        ]) {
            const matches = documents.filter((document) => document.anchor === anchor);
            expect(matches, anchor).toHaveLength(1);
            expect(matches[0].slug).toBe(`dapter/design/${slug}`);
        }
    });

    it('keeps method callbacks scoped and separate from authorized package-routed actions', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const source = (name) =>
            wrapper
                .findAllComponents(CodeExample)
                .find((item) => item.props('label') === name)
                .props('code');
        expect(source('Proposed private source callback members, unavailable')).toContain(
            'activeItems(Builder $source, bool $value): Builder',
        );
        expect(text).toContain('A zero-argument method returning a fresh query would discard');
        expect(text).toContain('Method-level declarations reject apply');
        expect(
            source('Proposed dedicated action class and options registration, unavailable'),
        ).toContain('public function options(): StoreOptions');
        expect(text).toContain('application declares no per-action routes or proxy controllers');
        expect(text).toContain('disallowed mode returns 406');
        expect(text).toContain(
            'FormRequest authorization and validation complete before the action',
        );
        expect(text).toContain('A mutation is never coalesced');
        expect(
            wrapper.get('a[href="https://inertiajs.com/docs/v3/the-basics/http-requests"]').text(),
        ).toContain('useHttp');
        wrapper.unmount();
    });

    it('shares only one explicit store handle while preserving independent adapters and private controls', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        expect(text).toContain('Source name identifies a server definition, not a client instance');
        expect(text).toContain(
            'strict object identity, shared reactive state, and one request generation',
        );
        expect(text).toContain('first creator fixes configuration');
        expect(text).toContain("Options API's setup()");
        expect(text).toContain('public handle never contains them');
        expect(text).toContain('unconfigured consumer linter');
        expect(text).toContain('Dapter exports useDataAdapter and DataAdapterHandle');
        expect(
            wrapper
                .findAllComponents(RoadmapPhase)
                .map((item) => item.props('id'))
                .indexOf('phase-2a-add-authorized-datastore-actions'),
        ).toBe(3);
        expect(
            wrapper
                .findAllComponents(RoadmapItem)
                .filter((item) => item.props('id').startsWith('todo-2a-'))
                .every((item) => item.props('status') === 'completed'),
        ).toBe(true);
        wrapper.unmount();
    });
    function example(wrapper, label) {
        return wrapper
            .findAll('figure')
            .find((figure) => figure.get('figcaption').text().includes(label));
    }

    it('publishes checked query defaults and counts without exposing future query APIs', () => {
        const operations = render(Operations, 'dapter/design/operations');
        const table = operations
            .findAll('table')
            .find((node) => node.get('caption').text() === 'Planned managed scalar domains');
        expect(table.text()).toContain('Neither numeric zero nor string zero is a boolean');
        expect(table.text()).toContain('without exact decimal guarantees');
        expect(operations.text()).toContain('A missing Collection target is a configuration error');
        expect(operations.text()).toContain('no Unicode normalization');
        expect(operations.text()).toContain('Integer targets accept an optional minus sign');
        expect(operations.text()).toContain('Current protocol 1 still rejects managed search');
        const code = operations
            .findAllComponents(CodeExample)
            .find(
                (component) =>
                    component.props('label') ===
                    'Planned query semantics reference, unavailable as a package API',
            );
        expect(code.props('code')).toBe(queryReference);
        operations.unmount();

        const roadmap = render(Roadmap, 'dapter/roadmap');
        expect(
            roadmap
                .findAllComponents(RoadmapItem)
                .find((item) => item.props('id') === 'todo-0-5')
                .props('status'),
        ).toBe('completed');
        roadmap.unmount();

        const sections = extractProposalDocumentation();
        const section = (anchor) => sections.find((entry) => entry.anchor === anchor);
        expect(section('query-contract-reference').body).toContain('summarizeOffset');
        expect(section('pagination-and-consistency').body).toContain('Derive pages from filtered');
        expect(section('pagination-and-consistency').body).toContain(
            'total 4, filtered 2, pages 2, and current 2',
        );
    });

    it('renders the full proposal, semantic tables, phase lists, and registered guide links', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        expect(wrapper.get('h1').text()).toBe('Dapter roadmap');
        expect(text).toContain(
            'Dapter 1.0.0-beta.3 includes Collection, SQLite, MySQL, and PostgreSQL backend offset reads and explicit v2 field operations.',
        );
        expect(text).toContain('<DataAdapter source="Products">');
        expect(text).toContain('total: 100');
        expect(text).toContain('filtered: 0');
        expect(text).toContain('joined_table.id');
        expect(text).toContain('The server owns the allowed operations.');
        expect(text).toContain('Native actions now work with both read versions.');
        expect(text).toContain(
            'Phases 2a, 3, 3a, 4, 5, and 6 passed their final acceptance gates.',
        );
        expect(text).not.toContain(
            'Global operations, Resources, actions, and live updates remain unavailable.',
        );
        expect(text).not.toContain('Infinite mode remains unavailable.');
        expect(text).not.toContain('Infinite mode remains proposed.');
        expect(text).toContain('does not freeze a changing dataset');
        expect(text).not.toContain('&#39;');
        expect(wrapper.findAll('table')).toHaveLength(11);
        expect(wrapper.get('table caption').text()).toBe('Source ownership and boundaries');
        expect(wrapper.findAll('h2')).toHaveLength(21);
        expect(wrapper.findAll('h3[id^="phase-"]')).toHaveLength(10);
        expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(0);
        expect(wrapper.findAllComponents(RoadmapItem)).toHaveLength(61);
        expect(wrapper.findAllComponents(RoadmapPhase)).toHaveLength(10);
        const sectionIds = wrapper.findAll('h2').map((heading) => heading.attributes('id'));
        expect(sectionIds.indexOf('delivery-phases-and-exit-criteria')).toBe(
            sectionIds.indexOf('the-smallest-useful-implementation') + 1,
        );
        expect(sectionIds.indexOf('ownership-and-reusable-contracts')).toBeGreaterThan(
            sectionIds.indexOf('delivery-phases-and-exit-criteria'),
        );
        expect(
            wrapper
                .findAllComponents(RoadmapItem)
                .filter((item) => item.props('status') === 'completed').length,
        ).toBe(61);
        expect(text).toContain(
            'Completion is authored in this documentation and tracks only this roadmap',
        );
        expect(text).toContain('Opening an item does not change its status.');
        for (const slug of ['dapter', 'dapter/installation', 'dapter/development']) {
            expect(wrapper.get(`a[href="/docs/${slug}"]`).text()).not.toBe('');
        }
        expect(
            wrapper
                .get('a[href="https://www.php.net/manual/en/language.attributes.overview.php"]')
                .attributes('target'),
        ).toBe('_blank');
        wrapper.unmount();
    });

    it('documents the proposed source-bound driver and the four native execution targets', () => {
        const wrapper = renderProposal();
        const code = example(wrapper, 'Current StoreDriver interface').get('pre code').text();
        expect(code).toContain('interface StoreDriver');
        expect(code).toContain('public function capabilities(): DriverCapabilities;');
        expect(code).toContain('public function execute(ValidatedReadPlan $plan): RawPage;');
        const table = wrapper.get('[aria-label="Proposed built-in store drivers"]');
        expect(table.findAll('tbody tr td:first-child').map((cell) => cell.text())).toEqual([
            'CollectionStoreDriver',
            'SqliteStoreDriver',
            'MySqlStoreDriver',
            'PostgresStoreDriver',
        ]);
        const text = wrapper.text();
        expect(text).toContain('uses those same rules to validate the entire request');
        expect(text).toContain('UnsupportedStoreOperation');
        expect(text).toContain(
            'Vector retrieval research established native pgvector feasibility.',
        );
        expect(text).toContain('Availability does not require a submitted vector');
        expect(text).toContain('check the actual prepared vector for finite numeric values');
        wrapper.unmount();
    });

    it('keeps an explicit optional custom-options contract and a fresh config-seeded fluent builder', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const declaration = example(wrapper, 'Proposed StoreOptions declaration');
        const code = declaration.get('pre code').text();

        expect(wrapper.get('#declaration-choices').text()).toBe('Declaration choices');
        expect(wrapper.get('#store-options').text()).toBe('A compact StoreOptions builder');
        expect(code).toContain('extends CollectionDataSource implements WithOptions');
        expect(code).toContain('use ArtisanToolbox\\Dapter\\Contracts\\WithOptions;');
        expect(code).toContain('public function options(): StoreOptions');
        expect(code).toContain('return StoreOptions::make()');
        expect(code).toContain("'name' => 'Notebook', 'status' => 'active', 'price' => 20");
        for (const declaration of [
            "->searchableField('name', matchTypes: [MatchType::Contains, MatchType::Equals])",
            "->orderableField('price', sortTypes: [SortType::Numeric])",
            "->filterableField('user_id', 'new_sales', values: [7, 9], multiple: true, empty: EmptySelectionPolicy::Clear)",
            '->globalSearchable([',
            "->globalOrderable('by_price', label: 'Lowest price',",
            "->globalFilterable('only_news', values: [false, true],",
            '->pageSize(25)',
            '->pageSizeOptions([10, 25, 50])',
        ]) {
            expect(code).toContain(declaration);
        }
        expect(code).not.toContain('&lt;');
        expect(declaration.get('figcaption').text()).toContain('not current package usage');
        expect(text).toContain('proposed and unavailable');
        expect(text).toContain('source implements only source()');
        expect(text).toContain(
            'Attributes work without WithOptions, a trait, a public hook, or provider registration',
        );
        expect(text).toContain('ordinary PHP inheritance');
        expect(text).toContain(
            'public options() method without WithOptions is a configuration error',
        );
        expect(text).toContain('StoreOptions has a private constructor');
        expect(text).toContain('Fluent methods return self');
        expect(text).toContain('fresh StoreOptions::make()');
        expect(text).toContain('Uncalled defaults never erase attributes');
        expect(text).toContain('Attribute arguments contain supported metadata');
        expect(text).toContain('baseline engines pass the shared behavioral cases');
        for (const obsolete of [
            'WithSearch',
            'WithSorting',
            'WithFilters',
            'WithPaging',
            'PagingOptions',
            'public function search()',
            'public function paging()',
        ]) {
            expect(text).not.toContain(obsolete);
        }
        wrapper.unmount();
    });

    it('documents concrete backend enums separately from scalar wire values and open identifiers', () => {
        const wrapper = renderProposal();
        expect(wrapper.get('#closed-domain-enums').text()).toBe('Closed backend domains use enums');
        const figures = wrapper.findAll('figure');
        const codeFor = (label) =>
            figures
                .find((figure) => figure.text().includes(label))
                .get('pre code')
                .text();
        const enums = codeFor('Proposed backed enum contracts');
        for (const name of [
            'MatchType',
            'PagingMode',
            'ValueType',
            'SortType',
            'SortDirection',
            'EmptySelectionPolicy',
            'SearchMatch',
        ]) {
            expect(enums).toContain(`enum ${name}: string`);
        }
        expect(enums).toContain("case EndsWith = 'ends_with'");
        expect(enums).toContain("case Boolean = 'boolean'");
        const declaration = codeFor('Proposed StoreOptions declaration');
        expect(declaration).toContain(
            "'valueType' => ValueType::Integer, 'matchType' => MatchType::Equals",
        );
        expect(declaration).toContain('empty: EmptySelectionPolicy::Clear');
        expect(declaration).not.toContain("matchTypes: ['contains'");
        expect(codeFor('Current paging defaults with a proposed broadcasting extension')).toContain(
            "'mode' => PagingMode::Offset",
        );
        const documents = extractProposalDocumentation();
        const body = documents.find(({ anchor }) => anchor === 'closed-domain-enums').body;
        for (const contract of [
            'MVP contract, not a later optional feature',
            'Public PHP parameters never accept MatchType|string',
            'PHP has no native generic array element type',
            'first verify their exact primitive type',
            'known-but-forbidden values fail before operation handlers or driver listing reads',
            'They remain validated open domains',
        ]) {
            expect(body).toContain(contract);
        }
        expect(
            wrapper
                .get(
                    'a[href="https://www.php.net/manual/en/language.enumerations.expressions.php"]',
                )
                .attributes('target'),
        ).toBe('_blank');
        wrapper.unmount();
    });

    it('renders six operation kinds without competing flat APIs and keeps callbacks global', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const declaration = example(wrapper, 'Proposed StoreOptions declaration')
            .get('pre code')
            .text();
        const operations = wrapper.get('#field-global-operations').element.parentElement
            .textContent;
        for (const method of [
            'searchableField',
            'globalSearchable',
            'orderableField',
            'globalOrderable',
            'filterableField',
            'globalFilterable',
        ]) {
            expect(declaration).toContain(`->${method}(`);
        }
        expect(operations).toContain(
            'Field search, field order, and field filters apply automatically',
        );
        expect(operations).toContain(
            'Only global filter and global order presets accept callbacks',
        );
        expect(operations).toContain('Several named filters may share one field');
        expect(operations).toContain(
            'Search, order, and filters on name merge into one field node',
        );
        expect(operations).toContain('Never derive SQL from browser strings');
        expect(declaration).toContain("$source->sortBy([['price', 'asc'], ['id', 'asc']])");
        expect(text).toContain('Closure(TSource): TSource');
        expect(text).toContain('Closure(TSource, TValue): TSource');
        expect(text).toContain('global filter callback parameter two');
        expect(text).toContain('#[GlobalFilter(');
        for (const legacy of [
            /->searchable\(/,
            /->orderable\(/,
            /->filter\(/,
            /sort\.(available|current|do|presets|preset|usePreset|effective)/,
            /(?:^|\s)search\.(available|current|do|match)/,
            /(?:^|\s)filters\.(available|current|do)/,
            /FilterOption</,
        ]) {
            expect(text).not.toMatch(legacy);
        }
        wrapper.unmount();
    });

    it('renders checked metadata and nullable actions from a separate explicit schema', () => {
        const wrapper = renderProposal();
        const figures = wrapper.findAll('figure');
        const codeFor = (label) =>
            figures
                .find((figure) => figure.text().includes(label))
                .get('pre code')
                .text();
        const metadata = productDefinition;
        expect(codeFor('Proposed independent row and operation schema')).toBe(
            operationReference.trimEnd(),
        );
        expect(metadata.fields.user_id.filters.new_sales).toEqual({
            values: [7, 9],
            multiple: true,
            empty: 'clear',
        });
        expect(metadata.fields.user_id.search).toBeNull();
        expect(metadata.fields.user_id.order).toBeNull();
        expect(metadata.fields.price.filters).toBeNull();
        expect(metadata.fields.name.search.matchTypes).toEqual(['contains', 'equals']);
        expect(metadata.fields.price.order.sortTypes).toEqual(['numeric']);
        expect(metadata.global.search.targets).toEqual({
            name: { valueType: 'string', matchType: 'contains' },
            id: { valueType: 'integer', matchType: 'equals' },
        });
        expect(metadata.global.filters.only_news.values).toEqual([false, true]);
        expect(metadata.global.order.presets).toEqual([{ id: 'by_price', label: 'Lowest price' }]);
        expect(metadata.global.order.pagingModes).toEqual(['offset']);
        expect(metadata.global.multi_order).toBe(true);
        expect(metadata.global.multi_order_limit).toBe(3);
        const wire = JSON.stringify(metadata);
        expect(wire).not.toMatch(
            /callback|apply|Closure|ArtisanToolbox|SELECT|joined_table|"call":|"clear":/,
        );
        const types = codeFor('Proposed independent row and operation schema');
        expect(types).toContain("'contains' | 'equals' | 'starts_with' | 'ends_with'");
        expect(types).toContain(
            "'native' | 'regular' | 'string' | 'natural' | 'numeric' | 'locale'",
        );
        const actions = codeFor('Proposed independent row and operation schema');
        for (const call of [
            'fields.user_id?.filters?.new_sales?.call({ value: [7, 9] })',
            "fields.name?.search?.call({ value: 'Notebook', matchType: 'contains' })",
            "fields.price?.order?.call({ direction: 'asc', sortType: 'numeric', multiSort: true })",
            "global.search?.call({ value: 'Notebook' })",
            'global.filters?.only_news?.call({ value: true })',
            "global.order?.call({ id: 'by_price' })",
            'global.filters?.only_news?.call({ value: false })',
            "global.filters?.only_news?.clear({ page: 'preserve' })",
            'slot.paging.per_page.setValue(25)',
            'slot.paging.goToNext()',
        ]) {
            expect(actions.replace(/\s+/g, '').replace(/,}/g, '}')).toContain(
                call.replace(/\s+/g, ''),
            );
        }
        const text = wrapper.text();
        expect(text).toContain('TRecord describes the post-Resource data shape');
        expect(text).toContain('Source-only rows have type unknown');
        expect(text).toContain('A decoder cannot add permissions or broaden allowed values');
        expect(types).toContain('values: [7, 9]');
        expect(actions).toContain('if (!slot.ready) return;');
        expect(metadata.global.searchMatch).toEqual({ default: 'all', allowed: ['all', 'any'] });
        expect(text).toContain('reader authorization may remove a named entry');
        expect(text).toContain('A null capability has no function to invoke');
        expect(text).toContain('matchType, matchTypes, sortType, and sortTypes');
        wrapper.unmount();
    });

    it('indexes canonical selections, grouping, strict values, and exclusive offset-only callback ordering', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;
        expect(body('field-global-operations')).toContain('globalSearchable');
        expect(body('requested-operation-state')).toContain('{ value: null }');
        expect(body('requested-operation-state')).toContain('{ value: false }');
        expect(body('requested-operation-state')).toContain('{ value: 0 }');
        expect(body('requested-operation-state')).toContain('patch only the addressed selection');
        expect(body('requested-operation-state')).toContain('empty-list clear or reject policy');
        expect(body('requested-operation-state')).toContain('replaceState(next)');
        expect(body('requested-operation-state')).toContain("kind: 'fields'");
        expect(body('requested-operation-state')).toContain("kind: 'preset'");
        expect(body('requested-operation-state')).toContain('Priority is the terms array index');
        expect(body('dynamic-search')).toContain(
            'scope AND filters AND (field A AND (global target A OR global target B))',
        );
        expect(body('dynamic-search')).toContain(
            'scope AND filters AND (field A OR (global target A OR global target B))',
        );
        expect(body('dynamic-search')).toContain(
            'If all targets are incompatible, the global search group is false',
        );
        expect(body('dynamic-search')).toContain('Never drop an active restriction');
        expect(body('dynamic-search')).toContain('Invalid numeric field search returns HTTP 422');
        expect(body('sorting-and-complex-queries')).toContain(
            'A raw request containing both fails HTTP 422',
        );
        expect(body('sorting-and-complex-queries')).toContain(
            'Callback order presets are offset-only',
        );
        expect(body('sorting-and-complex-queries')).toContain(
            'cannot infer arbitrary comparator ties',
        );
        expect(body('sorting-and-complex-queries')).toContain(
            'without changing state or silently switching paging mode',
        );
        expect(body('filter-application-callbacks')).toContain(
            'Validate every requested operation before constructing handlers or running listing queries',
        );
        expect(body('todo-2-1')).toContain('explicit operation definitions');
        expect(body('todo-3-2')).toContain('offset-only');
        expect(body('todo-4-3')).toContain('Reject opaque callback order presets with HTTP 422');
    });

    it('publishes primary research and explicit scoped preservation rules', () => {
        const wrapper = renderProposal();
        const tables = wrapper.findAll('table');
        const research = tables.find((table) =>
            table.text().includes('Verified competitor behavior and Dapter design implications'),
        );
        const matrix = tables.find((table) =>
            table.text().includes('Proposed action and state preservation matrix'),
        );
        expect(wrapper.get('#competitor-state-research').text()).toBe('Competitor state research');
        expect(wrapper.get('#state-preservation-matrix').text()).toBe(
            'State preservation by action',
        );
        for (const source of [
            'https://tanstack.com/table/v8/docs/guide/sorting',
            'https://tanstack.com/table/v8/docs/guide/pagination',
            'https://www.ag-grid.com/javascript-data-grid/row-sorting/',
            'https://www.ag-grid.com/javascript-data-grid/column-state/',
            'https://mui.com/x/react-data-grid/sorting/',
            'https://mui.com/x/react-data-grid/state/',
            'https://primevue.dev/datatable/',
            'https://github.com/primefaces/primevue/blob/4.5.5/packages/primevue/src/datatable/DataTable.vue',
            'https://datatables.net/reference/api/draw()',
        ]) {
            expect(research.get(`a[href="${source}"]`).text()).not.toBe('');
        }
        expect(research.text()).toContain('Pro or higher');
        expect(research.text()).toContain('The docs application installs 4.5.5');
        expect(research.text()).toContain('multiple-sort header branch does not call that reset');
        expect(research.text()).toContain('draw(false)');
        for (const contract of [
            'Replace its own clause; retain the others',
            'Replace with that field only',
            'Update in place or append',
            'Remove only the addressed',
            'Retain latest requested criteria',
            'Honor supplied position and size atomically, with one load',
            'mandatory scope remains',
            'no automatic sharing',
        ]) {
            expect(matrix.text()).toContain(contract);
        }
        const text = wrapper.text();
        for (const contract of [
            'multiOrder(true, max: 3)',
            'multiSort input defaults to false',
            'a new field fails atomically without evicting another term',
            'An additive field call while an opaque preset is active fails without mutation',
            'only for ordinary offset pagination with exact counts',
            'Unsupported preservation resolves a typed local failure without mutation or a request',
            'Identical canonical requested intent',
            'pending debounced search followed by sorting',
            'Editing Notebook to Pencil replaces the same search clause',
            'accepted snapshot is display evidence',
            'Explicit reload retries that retained intent',
        ]) {
            expect(text).toContain(contract);
        }
        const figures = wrapper.findAll('figure');
        const types = figures
            .find((figure) =>
                figure.text().includes('Proposed independent row and operation schema'),
            )
            .get('pre code')
            .text();
        expect(types).toContain('options?: InvocationOptions');
        expect(types).toContain('multiSort?: Multi extends true ? boolean : false');
        expect(types).not.toContain('priority?:');
        expect(types).toContain("D['global']['multi_order']");
        const actions = figures
            .find((figure) =>
                figure.text().includes('Proposed independent row and operation schema'),
            )
            .get('pre code')
            .text();
        expect(actions).toContain("Pick<MouseEvent, 'ctrlKey' | 'metaKey'>");
        expect(actions).toContain('event.ctrlKey || event.metaKey');
        wrapper.unmount();
    });

    it('indexes preservation evidence and the action matrix at their own anchors', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;
        expect(body('competitor-state-research')).toContain('TanStack Table v8');
        expect(body('competitor-state-research')).toContain('draw(false)');
        expect(body('state-preservation-matrix')).toContain('Reload or polling');
        expect(body('state-preservation-matrix')).toContain('Retain latest requested criteria');
        expect(body('state-preservation-matrix')).toContain('Editing Notebook to Pencil');
        expect(body('requested-operation-state')).toContain('resetState()');
        expect(body('requested-operation-state')).toContain("page: 'preserve'");
    });

    it('renders complete attribute parity and keyed fluent composition without opt-in scaffolding', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const table = wrapper
            .findAll('table')
            .find(
                (entry) => entry.get('caption').text() === 'Proposed fluent and attribute parity',
            );
        const pairs = [
            ['searchableField', 'SearchableField'],
            ['orderableField', 'OrderableField'],
            ['filterableField', 'FilterableField'],
            ['globalSearchable', 'GlobalSearch'],
            ['globalOrderable', 'GlobalOrder'],
            ['globalFilterable', 'GlobalFilter'],
            ['searchMatch', 'SearchGrouping'],
            ['multiOrder', 'MultiOrder'],
            ['pagingMode', 'Paging'],
            ['pageSize', 'PageSize'],
            ['pageSizeOptions', 'PageSizeOptions'],
            ['broadcastUpdatable', 'BroadcastUpdatable'],
            ['useResource', 'UseResource'],
            ['withActions', 'Actions'],
            ['guard', 'Guard'],
            ['authorize', 'Authorize'],
            ['publicAccess', 'PublicAccess'],
            ['withoutFieldSearch', 'WithoutFieldSearch'],
            ['withoutFieldOrder', 'WithoutFieldOrder'],
            ['withoutFieldFilter', 'WithoutFieldFilter'],
            ['withoutGlobalSearch', 'WithoutGlobalSearch'],
            ['withoutGlobalOrder', 'WithoutGlobalOrder'],
            ['withoutGlobalFilter', 'WithoutGlobalFilter'],
        ];
        const rows = table.findAll('tbody tr');
        expect(rows).toHaveLength(pairs.length);
        for (const [index, [fluent, attribute]] of pairs.entries()) {
            const cells = rows[index].findAll('td');
            expect(cells[0].text()).toContain(fluent);
            expect(cells[1].text()).toContain(attribute);
        }
        const codeFor = (label) =>
            wrapper
                .findAll('figure')
                .find((figure) => figure.text().includes(label))
                .get('pre code')
                .text();
        const attributes = codeFor('Attribute-only source design illustration');
        expect(attributes).toContain(
            "#[SearchableField('name', matchTypes: [MatchType::Contains])]",
        );
        expect(attributes).toContain(
            "#[FilterableField('status', 'availability', values: ['active', 'pending'])]",
        );
        expect(attributes).toContain('#[PageSize(25)]');
        expect(attributes).toContain("['id' => 1, 'name' => 'Notebook', 'status' => 'active']");
        expect(attributes).not.toMatch(/function options|implements|WithOptions/);
        const composed = codeFor('Attributes and fluent settings design illustration');
        expect(composed).toContain('#[PageSize(25)]');
        expect(composed).toContain('extends CollectionDataSource implements WithOptions');
        expect(composed).toContain('->pageSizeOptions([10, 50])');
        expect(composed).toContain("->orderableField('price', sortTypes: [SortType::Numeric])");
        for (const contract of [
            'ancestor attributes from root to leaf',
            'then explicit fluent declarations',
            'baseline separate from explicit declarations',
            'Calling a setter explicitly, even with the same value as config, records an override',
            'same argument contract, enum cases, advanced option DTOs',
            'Basic shortcuts belong to phase 1',
            'whole lower capability entry at its exact key',
            'Duplicate named entries in the effective fluent layer remain invalid',
            'two singleton attributes on one class fail configuration',
            'declaration and removal at the same key in one layer fail configuration',
            'trusted declaration tombstones',
            'No parent call is needed to retain attributes',
            '[10, 50, 25]',
            'PublicAccess(false)',
            'inherited attributes still participate',
        ]) {
            expect(text).toContain(contract);
        }
        expect(text).not.toMatch(/SearchbleField|losing attribute|whole attribute policy/);
        wrapper.unmount();
    });

    it('preserves attributes with either factory and validates an empty baseline before protected work', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const code = wrapper
            .findAll('figure')
            .find((figure) => figure.text().includes('Empty-baseline design illustration'))
            .get('pre code')
            .text();
        expect(code).toContain('extends CollectionDataSource implements WithOptions');
        expect(code).toContain("#[SearchableField('name', matchTypes: [MatchType::Contains])]");
        expect(code).toContain('return StoreOptions::makeWithoutDefaults()');
        expect(code).toContain("->guard('web')");
        expect(code).toContain('->pagingMode(PagingMode::Offset)');
        expect(code).toContain('->pageSize(25)');
        expect(code).not.toContain('pageSizeOptions(');
        for (const contract of [
            'source contracts do not require public options()',
            'Optional WithOptions alone requires options(): StoreOptions',
            'public hook exactly once before proceeding to normalization or source work',
            'public options() method without WithOptions is a configuration error',
            'attribute presence alone is never an error',
            'Reject an invalid hook return before protected work',
            'not an unconditional public base hook or implicit interface implementation',
            'StoreOptions::make() starts with a snapshot of package config',
            'StoreOptions::makeWithoutDefaults() starts with no package-config values',
            'Both factories preserve inherited and concrete attributes',
            'internal resolver must not re-add config',
            'config-seeded builder with no setters keeps attributes',
            'Its allowed size list is [25]',
            "#[Guard('web')]",
            '#[Paging(PagingMode::Offset)]',
            'Missing paging mode, positive chosen page size, or guard fails sanitized configuration validation',
            'A guard is required even for public access',
            'Authentication remains required unless publicAccess(true)',
            'Missing config never implies anonymous access',
            'Eloquent row identity and source-order inference remain source invariants',
        ]) {
            expect(text).toContain(contract);
        }
        expect(text).not.toContain('source contracts include public options()');
        expect(text).not.toContain('base options() method returns');
        wrapper.unmount();
    });

    it('documents concrete invokable handlers in both declaration styles with request-local resolution', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const code = wrapper
            .findAll('figure')
            .find((figure) =>
                figure
                    .text()
                    .includes('Proposed invokable classes with fluent and attribute forms'),
            )
            .get('pre code')
            .text();
        expect(wrapper.get('#invokable-global-handlers').text()).toBe(
            'Invokable global filter and order handlers',
        );
        expect(code).toContain(
            'public function __invoke(Collection $source, bool $value): Collection',
        );
        expect(code).toContain('public function __invoke(Collection $source): Collection');
        expect(code).toContain(
            "->globalFilterable('only_news', values: [false, true], apply: OnlyNews::class)",
        );
        expect(code).toContain(
            "->globalOrderable('by_price', label: 'Lowest price', apply: ByPrice::class)",
        );
        expect(code).toContain(
            "#[GlobalFilter('only_news', values: [false, true], apply: OnlyNews::class)]",
        );
        expect(code).toContain(
            "#[GlobalOrder('by_price', label: 'Lowest price', apply: ByPrice::class)]",
        );
        expect(code).toContain("$source->sortBy([['price', 'asc'], ['id', 'asc']])");
        expect(code).not.toContain('implements');
        for (const contract of [
            'Closure|string',
            'class-string',
            'public nonstatic __invoke',
            'constructor injection',
            'after access checks and complete request validation',
            'constructs no handler instances',
            'Do not inject services into invocation operands',
            'PHP contravariance',
            'Shared singleton bindings must never retain reader or tenant context',
            'sanitized configuration error',
            'wrong actual source return or handler exception is a source fault',
            'Neither handler classes nor service instances appear in browser input or client metadata',
            'explicit array-element enum binding',
            'Resource projection use the intended recipient context',
        ]) {
            expect(text).toContain(contract);
        }
        wrapper.unmount();
    });

    it('indexes layered options, complete shortcuts, handler classes, and prerequisite tasks at their authored anchors', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;
        expect(body('declaration-choices')).toContain('options(): StoreOptions');
        expect(body('declaration-choices')).toMatch(
            /without WithOptions\s*, a trait, a public hook, or provider registration/,
        );
        expect(body('declaration-choices')).toContain('ordinary PHP inheritance');
        expect(body('store-options')).toContain('public function options(): StoreOptions');
        expect(body('store-options')).toContain('StoreOptions::make()');
        expect(body('store-options')).toContain("->searchableField('name'");
        expect(body('store-options')).toContain('private constructor');
        expect(body('store-options')).toContain(
            'freezes server declarations and policy before binding the driver',
        );
        expect(body('store-options')).toContain('Uncalled defaults never erase attributes');
        for (const name of [
            'SearchableField',
            'PageSizeOptions',
            'Authorize',
            'WithoutGlobalFilter',
        ]) {
            expect(body('attribute-shortcuts')).toContain(name);
        }
        expect(body('attribute-shortcuts')).toContain('final class CatalogProducts');
        expect(body('attribute-shortcuts')).toContain('[10, 50, 25]');
        expect(body('attribute-shortcuts')).toContain('tombstones');
        expect(body('attribute-shortcuts')).toContain('makeWithoutDefaults()');
        expect(body('attribute-shortcuts')).toContain('final class ExplicitProducts');
        expect(body('attribute-shortcuts')).toContain('Its allowed size list is [25]');
        expect(body('attribute-shortcuts')).toContain('Paging(PagingMode::Offset)');
        expect(body('declaration-choices')).toContain('public hook exactly once');
        expect(body('declaration-choices')).toContain(
            'without WithOptions is a configuration error',
        );
        expect(body('declaration-choices')).toContain('attribute presence alone is never an error');
        expect(body('todo-1-1')).toContain('without reseeding the empty baseline');
        expect(body('todo-1-4')).toContain('empty baseline as sanitized configuration errors');

        expect(body('invokable-global-handlers')).toContain('apply: OnlyNews::class');
        expect(body('invokable-global-handlers')).toContain('apply: ByPrice::class');
        expect(body('invokable-global-handlers')).toContain('constructs no handler instances');
        expect(body('invokable-global-handlers')).toContain('PHP contravariance');
        expect(body('todo-0-1')).toContain('Every fluent capability has an attribute shortcut');
        expect(body('todo-1-1')).toContain('Ship basic attribute parity now');
        expect(body('todo-1-4')).toContain('without executing source() or constructing handlers');
        expect(body('todo-3-1')).toContain(
            'same optional WithOptions hook and independent attribute schema',
        );
        expect(body('todo-3-5')).toContain('basic attribute support delivered in phase 1');
        expect(body('todo-3-5')).toContain('constructor injection');
        expect(body('resource-serialization')).toContain('attributes still participate');
        expect(documents.map(({ body }) => body).join(' ')).not.toMatch(
            /PagingOptions|losing attribute|whole attribute policy/,
        );
    });

    it('renders config-seeded defaults and automatic chosen-size retention in either setter order', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const config = wrapper
            .findAll('figure')
            .find((figure) =>
                figure
                    .text()
                    .includes('Current paging defaults with a proposed broadcasting extension'),
            )
            .get('pre code')
            .text();

        expect(wrapper.get('#package-defaults').text()).toBe(
            'Package defaults and effective policy',
        );
        expect(config).toContain("'mode' => PagingMode::Offset");
        expect(config).toContain("'per_page' => 10");
        expect(config).toContain("'per_page_options' => [5, 10, 50, 100]");
        expect(text).toContain('its paging and guard keys, and optional publication');
        expect(text).toContain('additional broadcasting context below is proposed');
        expect(text).toContain('pageSize(25) is valid');
        expect(text).toContain('[5, 10, 50, 100, 25]');
        expect(text).toContain('pageSizeOptions(array) replaces the configured list');
        expect(text).toContain('first-declared order');
        expect(text).toContain('independently of setter order');
        expect(text).toContain('pageSize(25)->pageSizeOptions([5, 50, 5])');
        expect(text).toContain('[5, 50, 25]');
        expect(text).toContain('[5, 50, 10]');
        expect(text).toContain('Do not retain an intermediate auto-added size');
        expect(text).toContain('negative values, and non-integers, are configuration errors');
        expect(text).toContain(
            'Unspecified fluent settings retain attributes or selected baseline values',
        );
        expect(text).toContain('cannot add sizes, handlers, or capabilities');
        expect(text).toContain('never enables broadcasting');
        expect(text).toContain(
            'config contains cacheable scalars, arrays, and enum cases, never runtime',
        );
        expect(text).not.toContain('perPage: 25 alone is invalid');
        wrapper.unmount();
    });

    it('documents optional Resources, scoped committed updates, and replacement-only Echo behavior', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const code = wrapper
            .findAll('figure pre code')
            .map((figure) => figure.text())
            .join('\n');

        expect(text).toContain('No resource is configured by default');
        expect(text).toContain('class-string<JsonResource>');
        expect(text).toContain('filtering, sorting, and paging to raw rows before serialization');
        expect(text).toContain('JsonResource::resolve($request)');
        expect(text).toContain(
            'nested Resources and ResourceCollections with that same explicit request',
        );
        expect(text).toContain('hidden and visible fields');
        expect(text).toContain('identity metadata is part of the public wire contract');
        expect(text).toContain('post-Resource data shape');
        expect(text).toContain('per-reader delivery or an equivalent projection audience');
        expect(code).toContain('StoreOptions::make()->useResource(ProductResource::class)');
        expect(code).toContain('$store->update(identified: [1, 2])');
        expect(text).toContain('already server-resolved store with source, tenant, and audience');
        expect(text).toContain('TIdentifier|list<TIdentifier>');
        expect(text).toContain('empty list a no-op');
        expect(text).toContain('Missing or unauthorized rows produce no payload');
        expect(text).toContain('Rollbacks emit nothing');
        expect(text).toContain('Never use unscoped Model::find');
        expect(text).toContain(
            'broadcastUpdatable(identifierField: null, channel: null, revisions: null, identity: null)',
        );
        expect(code).toContain('public function broadcastUpdatable(');
        expect(text).toContain('Omitting the declaration leaves broadcasts disabled');
        expect(text).toContain('qualified SQL selector');
        expect(text).toMatch(/custom primary[ -]key/);
        expect(text).toContain(
            'A changed sort or filter value still replaces the existing row in place',
        );
        expect(text).toContain(
            'Never insert, delete, reorder, automatically reload, or reconcile membership',
        );
        expect(text).toContain('Private admission intersects authentication');
        expect(text).toContain('Public delivery requires explicit source opt-in');
        expect(text).toContain('names an extra Laravel Gate');
        expect(text).toContain('Do not leave a shared channel still used by another adapter');
        expect(text).not.toContain('mixed|array');
        expect(text).not.toContain('mixed|mixed[]');
        for (const url of [
            'https://laravel.com/framework/docs/13.x/eloquent-resources',
            'https://laravel.com/framework/docs/13.x/broadcasting',
            'https://inertiajs.com/docs/v3/data-props/polling',
        ]) {
            expect(wrapper.get(`a[href="${url}"]`).attributes('target')).toBe('_blank');
        }
        wrapper.unmount();
    });

    it('indexes live updates, bounded races, and opt-in standalone polling at their authored anchors', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;

        expect(body('resource-serialization')).toContain('useResource(ProductResource::class)');
        expect(body('resource-serialization')).toContain(
            'identity metadata is part of the public wire contract',
        );
        expect(body('broadcast-updates')).toContain('$store->update(identified: [1, 2])');
        expect(body('broadcast-updates')).toContain(
            'A changed sort or filter value still replaces',
        );
        expect(body('broadcast-updates')).toContain(
            'without adapter search, selectable filters, sort, or the current page window',
        );
        expect(body('broadcast-channel-authorization')).toContain(
            'Private admission intersects authentication',
        );
        expect(body('broadcast-channel-authorization')).toContain(
            'Public delivery requires explicit source opt-in',
        );
        expect(body('broadcast-channel-authorization')).toContain('PrivateChannel');
        expect(body('broadcast-request-races')).toContain('per-instance context generations');
        expect(body('broadcast-request-races')).toContain('event-ID deduplication');
        expect(body('broadcast-request-races')).toContain(
            'replay applicable events in received order',
        );
        expect(body('broadcast-request-races')).toContain(
            'Arrival order is not database freshness',
        );
        expect(body('broadcast-request-races')).toContain('provider is optional');
        expect(body('broadcast-request-races')).toContain('Arrival order');
        expect(body('broadcast-request-races')).toContain(
            'Never solve a race through an automatic reload',
        );
        expect(body('polling')).toContain('defaults to false');
        expect(body('polling')).toContain(':polling="{ interval: 15000 }"');
        expect(body('polling')).toContain('Skip active requests');
        expect(body('polling')).toContain('after settlement and Vue rendering');
        expect(body('polling')).toContain('hidden or offline');
        expect(body('polling')).toContain('clear timers on unmount');
        expect(body('polling')).toContain('Pause polling on failure');
        expect(body('polling')).toContain('successful explicit retry');
        expect(body('polling')).toContain('There is no automatic failure retry loop');
        expect(body('polling')).toContain('resets the accumulated window to its first page');
        expect(body('polling')).toContain('not a proven direct scheduler for standalone');
        expect(body('polling')).toContain("Inertia's usePoll refreshes an Inertia page");
        expect(body('todo-3a-4')).toContain('Never insert, remove, reorder, reconcile');
        expect(body('todo-3a-5')).toContain('Do not require new revision infrastructure');
    });

    it('renders source-first filter transforms and type-directed enum binding without implying implementation', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        const callbacks = wrapper
            .findAll('figure')
            .find((figure) =>
                figure.text().includes('Proposed Builder and Collection filter transforms'),
            )
            .get('pre code')
            .text();
        const attribute = wrapper
            .findAll('figure')
            .find((figure) => figure.text().includes('Proposed PHP 8.5 filter metadata'))
            .get('pre code')
            .text();

        expect(wrapper.get('#filter-application-callbacks').text()).toBe(
            'Filter application callbacks',
        );
        expect(text).toContain('Closure(TSource, TValue): TSource');
        expect(text).toContain('second argument is the validated selected value');
        expect(text).toContain('returning the identical object is not required');
        expect(callbacks).toContain('static function (Builder $source, Status $value): Builder');
        expect(callbacks).toContain(
            'static function (Collection $source, mixed $value): Collection',
        );
        expect(callbacks).toContain('values: [Status::Active, Status::Pending]');
        expect(callbacks).toContain("['id' => 1, 'status' => 'active']");
        expect(text).toContain(
            'These examples preserve historical callback signatures and named arguments',
        );
        expect(text).toContain(
            'Validate every requested operation before constructing handlers or running listing queries',
        );
        expect(text).toContain('rejects the whole request and invokes zero handlers');
        expect(text).toContain(
            'mixed parameter receives the validated wire value without automatic enum conversion',
        );
        expect(text).toContain('explicit enum-element binding metadata');
        expect(text).toContain('Reflection alone does not infer PHPDoc element types');
        expect(text).toContain('Do not replay callbacks for counts');
        expect(text).toContain('wrong source return type or handler exception is a source fault');
        expect(attribute).toContain('#[GlobalFilter(');
        expect(attribute).toContain(
            'static function (Collection $source, Status $value): Collection',
        );
        expect(text).toContain(
            'PHP 8.5 permits static closures and first-class callables in attribute parameters',
        );
        expect(text).not.toContain('mixed|array');
        for (const url of [
            'https://www.php.net/releases/8.5/en.php',
            'https://www.php.net/manual/en/language.enumerations.backed.php',
            'https://www.php.net/manual/en/language.enumerations.basics.php',
        ]) {
            expect(wrapper.get(`a[href="${url}"]`).attributes('target')).toBe('_blank');
        }
        wrapper.unmount();
    });

    it('indexes defaults, strict filter failures, and enum binding at their authored anchors', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;

        expect(body('package-defaults')).toContain("'per_page_options' => [5, 10, 50, 100]");
        expect(body('package-defaults')).toContain(
            'Unspecified fluent settings retain attributes or selected baseline values',
        );
        expect(body('package-defaults')).toContain('pageSize(25) is valid');
        expect(body('package-defaults')).toContain('[5, 10, 50, 100, 25]');
        expect(body('package-defaults')).toContain('before listing reads');
        expect(body('filter-application-callbacks')).toContain('Closure(TSource, TValue): TSource');
        expect(body('filter-application-callbacks')).toContain('invokes zero handlers');
        expect(body('filter-application-callbacks')).toContain('Builder $source, Status $value');
        expect(body('filter-application-callbacks')).toContain('Collection $source, mixed $value');
        expect(body('filter-application-callbacks')).toContain(
            'without loose PHP equality or coercion',
        );
        expect(body('enum-filter-binding')).toContain('Status::Archived case remains forbidden');
        expect(body('enum-filter-binding')).toContain(
            'mixed parameter receives the validated wire value',
        );
        expect(body('enum-filter-binding')).toContain(
            'Type and subset membership checks precede binding',
        );
        expect(body('enum-filter-binding')).toContain('explicit enum-element binding metadata');
        expect(body('enum-filter-binding')).toContain('integer versus string mismatches');
        expect(body('enum-filter-binding')).toContain('pure enum case names');
        expect(body('enum-filter-binding')).toContain('PHP 8.5 permits static closures');
        expect(body('enum-filter-binding')).toContain('without serializing closure objects');
        expect(body('todo-1-9')).toContain('config publication and config-cache round trips');
        expect(body('todo-3-4')).toContain('mixed wire values versus typed enum cases');
        expect(body('todo-3-5')).toContain('PHP 8.5 static closure attributes');
    });

    it('documents guard-bound Gate checks and access-loss cleanup before protected reads', () => {
        const wrapper = renderProposal();
        const text = wrapper.text();
        expect(wrapper.get('#datastore-access-control').text()).toBe(
            'DataStore authentication and authorization',
        );
        const code = wrapper
            .findAll('figure')
            .find((figure) => figure.text().includes('Proposed guard and Laravel policy binding'))
            .get('pre code')
            .text();
        expect(code).toContain("->guard('admin')");
        expect(code).toContain("->authorize('viewAny', Products::class)");
        expect(code).toContain('Gate::policy(Products::class, ProductsPolicy::class)');
        expect(code).toContain('$user->getAuthIdentifier() === 7');
        for (const contract of [
            'default is web',
            'Gate::forUser($selectedUser)->authorize($ability, $arguments)',
            'before source(), protected reads, counts, public capabilities',
            'Empty or unknown guards are configuration errors',
            'Without authorize(), required authentication still applies',
            'publicAccess() explicitly removes only the login requirement',
            'Gate::forUser(null)',
            'clear rows, counts, capability metadata, cursor history, and infinite windows',
            'only while access and identity context remain valid',
            "['guards' => [$selectedGuard]]",
            'Channel authorization runs on subscription',
            'Listener cleanup alone cannot revoke server delivery',
        ]) {
            expect(text.replace(/\s+/g, ' ')).toContain(contract);
        }
        wrapper.unmount();
    });

    it('indexes DataStore access declarations and their prerequisite TODOs', () => {
        const documents = extractProposalDocumentation();
        const body = (anchor) => documents.find((document) => document.anchor === anchor).body;
        expect(body('datastore-access-control')).toContain("->guard('admin')");
        expect(body('datastore-access-control')).toContain('denyAsNotFound()');
        expect(body('datastore-access-control')).toContain(
            'never frontend state or request overrides',
        );
        expect(body('todo-0-4')).toContain('web guard');
        expect(body('todo-1-3')).toContain('zero protected reads on rejection');
        expect(body('todo-3a-2')).toContain('queued recipient context');
        expect(body('broadcast-channel-authorization')).toContain('source authorization and Gate');
    });

    it('presents ordered TODOs with prerequisite-first delivery and verifiable completion', () => {
        const wrapper = renderProposal();
        const section = wrapper.get('#delivery-phases-and-exit-criteria').element.parentElement;
        expect(section.textContent).toContain('Implementation TODO and exit criteria');
        expect(section.textContent).toContain(
            'Mark an item Completed only after its acceptance evidence',
        );
        expect(section.textContent).toContain('Phases 1 and 2 together form the MVP.');

        const phases = [...section.querySelectorAll('h3[id^="phase-"]')];
        expect(phases.map(({ id }) => id)).toEqual([
            'phase-0-settle-the-contract',
            'phase-1-build-the-smallest-backend-path',
            'phase-2-complete-the-first-vue-experience',
            'phase-2a-add-authorized-datastore-actions',
            'phase-3-add-deeper-declarations-and-composed-operations',
            'phase-3a-add-live-updates-and-polling',
            'phase-4-add-honest-pagination-choices',
            'phase-5-add-guarded-infinite-loading',
            'phase-6-add-source-specific-comparison-capabilities',
            'phase-7-explore-advanced-retrieval-and-snapshots',
        ]);
        const phaseIds = ['0', '1', '2', '2a', '3', '3a', '4', '5', '6', '7'];
        const taskCounts = [7, 9, 8, 5, 6, 7, 6, 5, 4, 4];
        for (const [phase, heading] of phases.entries()) {
            const list = heading.closest('section').querySelector('ol');
            expect(list.tagName).toBe('OL');
            const tasks = [...list.querySelectorAll('li')];
            expect(tasks).toHaveLength(taskCounts[phase]);
            expect(tasks.map((task) => task.querySelector('[id]').id)).toEqual(
                Array.from(
                    { length: taskCounts[phase] },
                    (_, index) => `todo-${phaseIds[phase]}-${index + 1}`,
                ),
            );
            expect(
                tasks.map(
                    (task) =>
                        task
                            .querySelector('h4')
                            .textContent.trim()
                            .match(/^TODO \d[a-z]?\.\d\./)[0],
                ),
            ).toEqual(
                Array.from(
                    { length: taskCounts[phase] },
                    (_, index) => `TODO ${phaseIds[phase]}.${index + 1}.`,
                ),
            );
        }

        const prerequisites = [
            [
                'server authority',
                'versioned request schema',
                'mandatory server scope',
                'authenticated access by default',
                'Fix the defaults',
                'Define shared fixtures',
                'record accepted refinements',
            ],
            [
                'typed Eloquent and Collection source contracts',
                'minimal DataSource generator',
                'Resolve conventional public source names',
                'Enforce strict allowlists',
                'Collection offset pipeline',
                'equivalent ordinary Eloquent offset pipeline',
                'declared single-field sorting',
                'named JSON endpoint',
                'Run the same behavioral cases',
            ],
            [
                'typed response envelope',
                'first asynchronous source-only load',
                'numbered pagination',
                'declared sort, search, and scalar filter controls',
                'current-generation commits',
                'URL namespaces',
                'scroll-container reset',
                'table and a grid',
            ],
        ];
        for (const [phase, terms] of prerequisites.entries()) {
            const text = phases[phase].closest('section').querySelector('ol').textContent;
            let previousPosition = -1;
            for (const term of terms) {
                const position = text.indexOf(term);
                expect(
                    position,
                    `Phase ${phase} must place "${term}" after its prerequisites`,
                ).toBeGreaterThan(previousPosition);
                previousPosition = position;
            }
        }
        expect(section.textContent).toContain('Optional capabilities do not block one');
        expect(section.textContent).toContain('Unsupported cursor navigation remains null');
        wrapper.unmount();
    });

    it('extracts the real roadmap prose, count example, slot table, and every delivery phase for search', () => {
        const documents = extractProposalDocumentation();
        const section = (anchor) => documents.find((document) => document.anchor === anchor);
        expect(documents).toHaveLength(136);
        const tasks = documents.filter(({ anchor }) => /^todo-[0-7]a?-[1-9]$/.test(anchor ?? ''));
        expect(tasks).toHaveLength(61);
        expect(new Set(tasks.map(({ anchor }) => anchor)).size).toBe(61);
        expect(tasks.filter(({ body }) => body.startsWith('Completed '))).toHaveLength(61);
        expect(tasks.filter(({ body }) => body.startsWith('WIP '))).toHaveLength(0);
        const completedIds = [7, 9, 8, 5, 6, 7, 6, 5, 4, 4].flatMap((count, phase) =>
            Array.from(
                { length: count },
                (_, index) =>
                    `todo-${['0', '1', '2', '2a', '3', '3a', '4', '5', '6', '7'][phase]}-${index + 1}`,
            ),
        );
        expect(
            tasks.filter(({ body }) => body.startsWith('Completed ')).map(({ anchor }) => anchor),
        ).toEqual(completedIds);
        expect(section('phase-2a-add-authorized-datastore-actions').body).toContain(
            'Acceptance complete.',
        );
        expect(section('phase-3-add-deeper-declarations-and-composed-operations').body).toContain(
            'Acceptance complete.',
        );
        expect(section('phase-3a-add-live-updates-and-polling').body).toContain(
            'Acceptance complete.',
        );
        expect(section('phase-4-add-honest-pagination-choices').body).toContain(
            'Acceptance complete.',
        );
        expect(section('phase-5-add-guarded-infinite-loading').body).toContain(
            'Acceptance complete.',
        );
        const phaseIds = ['0', '1', '2', '2a', '3', '3a', '4', '5', '6', '7'];
        const expectedAnchors = [7, 9, 8, 5, 6, 7, 6, 5, 4, 4].flatMap((count, phase) =>
            Array.from({ length: count }, (_, index) => `todo-${phaseIds[phase]}-${index + 1}`),
        );
        expect(tasks.map(({ anchor }) => anchor)).toEqual(expectedAnchors);
        expect(documents[0].body).toContain(
            'Dapter 1.0.0-beta.3 includes Collection, SQLite, MySQL, and PostgreSQL backend offset reads and explicit v2 field operations.',
        );
        expect(section('the-smallest-useful-implementation').body).toContain(
            '<DataAdapter source="Products">',
        );
        expect(section('pagination-and-consistency').body).toContain('total: 100 and filtered: 0');
        expect(section('vue-slot-and-action-contract').body).toMatch(
            /paging\.total\s*,\s*paging\.filtered/,
        );
        expect(section('vue-slot-and-action-contract').body).toContain(
            'Counts with the semantics above, or null when not computed',
        );
        expect(section('public-identifiers-and-query-targets').body).toContain('joined_table.id');
        const phases = documents.filter(({ anchor }) => /^phase-[0-7]a?-/.test(anchor ?? ''));
        expect(phases).toHaveLength(10);
        for (const [index, phase] of phases.entries()) {
            const count = [7, 9, 8, 5, 6, 7, 6, 5, 4, 4][index];
            const expectedStatus = `Completed ${count} of ${count} tasks completed 100%`;
            expect(phase.slug).toBe('dapter/roadmap');
            expect(phase.body.startsWith(expectedStatus)).toBe(true);
            expect(phase.body).toContain('Exit when');
        }
        expect(section('completion-rules-for-every-implementation-phase').body).toContain(
            'Mark an item Completed only after its acceptance evidence',
        );
        for (const [phase, count] of [7, 9, 8, 5, 6, 7, 6, 5, 4, 4].entries()) {
            expect(section(`todo-${phaseIds[phase]}-${count}`).body).not.toContain('Exit when');
        }
        expect(section('todo-0-6').body).toContain('Define shared fixtures');
        expect(section('todo-1-9').heading).toContain('TODO 1.9.');
        expect(section('todo-1-9').body).toContain('all three databases');
        expect(section('phase-1-build-the-smallest-backend-path').body).toContain(
            'grouped OR searches',
        );
        expect(section('phase-1-build-the-smallest-backend-path').body).toContain('total: 100');
        expect(section('phase-1-build-the-smallest-backend-path').body).toContain('filtered: 0');
        expect(section('todo-2-5').body).toContain(
            'A stale response must not replace records or accepted state',
        );
        expect(section('phase-4-add-honest-pagination-choices').body).toContain(
            'Unsupported cursor navigation remains null',
        );
        expect(section('response-and-failure-rules').body).toContain('HTTP 422');
        for (const [anchor, contract] of [
            ['source-resolution-and-automatic-behavior', 'original body once'],
            ['response-and-failure-rules', '9007199254740991'],
            ['response-and-failure-rules', 'errors._dapter_kind'],
            ['response-and-failure-rules', 'server serializes both fields from one ErrorKind'],
            ['response-and-failure-rules', 'callback sees only the projected kind'],
            ['response-and-failure-rules', 'a maintenance page can produce the same parse error'],
            ['datastore-access-control', 'one generic 404 access body'],
            ['selectable-filters', 'one logical scalar domain'],
            ['filter-application-callbacks', 'A fresh same-model builder can widen scope'],
            ['requested-operation-state', 'Omitted selections mean clear'],
            ['url-ownership', 'exactly one load, even before metadata exists'],
            ['pagination-and-consistency', 'replaces its URL without issuing another load'],
            ['vue-slot-and-action-contract', 'Before the first accepted response'],
            ['vue-slot-and-action-contract', 'detached, deeply readonly copy'],
            ['broadcast-updates', 'same protocol parser and optional decodeRow as HTTP'],
            ['todo-3a-4', 'Rejected event data keeps the loaded row'],
            ['broadcast-channel-authorization', 'Patterns are disjoint and registration-stable'],
        ]) {
            expect(section(anchor).body).toContain(contract);
        }
        expect(section('ownership-and-reusable-contracts').body).toContain('HTTP integration');
        const drivers = section('store-drivers-and-capabilities');
        expect(drivers.heading).toBe('Store drivers and capabilities');
        expect(drivers.body).toContain('apply global scopes once to a private snapshot');
        expect(drivers.body).toContain('before issuing the capability profile or plan');
        expect(drivers.body).toContain('without replaying scopes');
        expect(drivers.body).toContain('After application handlers run');
        expect(drivers.body).toContain(
            'public function execute(ValidatedReadPlan $plan): RawPage;',
        );
        expect(drivers.body).toContain(
            'the driver performs zero listing reads or managed transforms',
        );
        expect(section('todo-7-4').body).toContain(
            'Ranked vector retrieval and snapshot APIs remain deferred',
        );
        expect(section('todo-7-3').body).toContain(
            'unsafe primary-key-only authorization boundary',
        );
        expect(section('todo-7-2').body).toContain(
            'configured MySQL driver without a vector implementation',
        );
    });
});

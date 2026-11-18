import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Actions from '../../pages/docs/dapter/Actions.vue';
import ActionDeclarations from '../../pages/docs/dapter/ActionDeclarations.vue';
import ActionOutcomes from '../../pages/docs/dapter/ActionOutcomes.vue';
import GlobalSearch from '../../pages/docs/dapter/GlobalSearch.vue';
import GlobalFilters from '../../pages/docs/dapter/GlobalFilters.vue';
import EnumInputs from '../../pages/docs/dapter/EnumInputs.vue';
import HandlerRequirements from '../../pages/docs/dapter/HandlerRequirements.vue';
import ComposedDeclarations from '../../pages/docs/dapter/ComposedDeclarations.vue';
import MultiOrder from '../../pages/docs/dapter/MultiOrder.vue';
import AdvancedQueries from '../../pages/docs/dapter/AdvancedQueries.vue';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import { sourceNavigation } from './sourceNavigationFixture';
const guides = [
    ['Actions', 'actions', Actions, ['action-outcomes', 'action-declarations']],
    [
        'ActionDeclarations',
        'action-declarations',
        ActionDeclarations,
        ['installation', 'action-outcomes'],
    ],
    ['ActionOutcomes', 'action-outcomes', ActionOutcomes, ['resources']],
    ['GlobalSearch', 'global-search', GlobalSearch, ['installation', 'global-filters']],
    ['GlobalFilters', 'global-filters', GlobalFilters, ['enum-inputs']],
    ['EnumInputs', 'enum-inputs', EnumInputs, ['installation', 'handler-requirements']],
    [
        'HandlerRequirements',
        'handler-requirements',
        HandlerRequirements,
        ['installation', 'composed-declarations'],
    ],
    [
        'ComposedDeclarations',
        'composed-declarations',
        ComposedDeclarations,
        ['installation', 'multi-order'],
    ],
    ['MultiOrder', 'multi-order', MultiOrder, ['installation', 'advanced-queries']],
    ['AdvancedQueries', 'advanced-queries', AdvancedQueries, ['installation', 'actions']],
];
describe('Dapter native action and composed task guides', () => {
    it.each(guides)(
        'renders %s with prerequisites, a visible title, idle public demos, and its next task',
        (_file, slug, component, nextLinks) => {
            const wrapper = mount(component, {
                props: {
                    page: {
                        slug: 'dapter/' + slug,
                        title: 'Verified task title',
                        description: 'Unpublished preview.',
                        package: {
                            id: 'dapter',
                            title: 'Dapter',
                            stability: 'Work in progress',
                            installedVersion: '1.x-dev',
                        },
                    },
                    navigation: sourceNavigation(),
                },
            });
            expect(wrapper.get('h1').text()).toBe('Verified task title');
            expect(wrapper.get('#starting-environment').exists()).toBe(true);
            expect(
                wrapper
                    .findAll('[aria-labelledby="next-guide"] a')
                    .map((link) => link.attributes('href')),
            ).toEqual(nextLinks.map((slug) => `/docs/dapter/${slug}`));
            expect(wrapper.findAll('[data-demo-frame]').length).toBeGreaterThan(0);
            expect(wrapper.text()).toContain('Ready.');
            if (slug === 'actions') {
                expect(wrapper.text()).toContain('Expose dapter.data through Ziggy');
                expect(wrapper.text()).toContain(
                    'Laravel sends the authorized action URL with the listing',
                );
                expect(wrapper.text()).toContain(
                    'The client does not require dapter.action in Ziggy',
                );
            }
            wrapper.unmount();
        },
    );
    it('indexes native commit uncertainty and composed public contracts at authored section destinations', () => {
        const documents = extractDocumentation(
            guides.map(([file, slug]) => ({
                slug: 'dapter/' + slug,
                title: file,
                description: 'Unpublished preview.',
                packageTitle: 'Dapter',
                sourcePath: `resources/js/pages/docs/dapter/${file}.vue`,
            })),
        );
        const body = (anchor) =>
            documents
                .filter((item) => item.anchor === anchor)
                .map((item) => item.body)
                .join(' ');
        expect(body('outcomes')).toContain('unknown commit');
        expect(body('declare-targets')).toContain('globalSearchable');
        expect(body('enum-domains')).toContain('EnumSubset');
        expect(body('counts')).toContain('CountQueries');
        expect(body('stability')).toContain('ResultIdentity');
    });
});

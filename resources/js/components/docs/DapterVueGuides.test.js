import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import VueControls from '../../pages/docs/dapter/VueControls.vue';
import VueDefinitions from '../../pages/docs/dapter/VueDefinitions.vue';
import VueNavigation from '../../pages/docs/dapter/VueNavigation.vue';
import { extractDocumentation } from '../../../../scripts/documentation-search.mjs';
import { sourceNavigation } from './sourceNavigationFixture';

const guides = [
    ['VueControls', 'dapter/vue-controls', 'Build declared Vue controls', VueControls],
    [
        'VueDefinitions',
        'dapter/vue-definitions',
        'Validate rows and definitions separately',
        VueDefinitions,
    ],
    ['VueNavigation', 'dapter/vue-navigation', 'Save catalog navigation in the URL', VueNavigation],
];
describe('Dapter Vue task guides', () => {
    it.each(guides)(
        'registers %s as a focused guide with an idle fixed-source demo',
        (_file, slug, title, component) => {
            const wrapper = mount(component, {
                props: {
                    page: {
                        slug,
                        title,
                        description: 'Dapter Vue preview.',
                        package: {
                            id: 'dapter',
                            title: 'Dapter',
                            stability: 'Beta',
                            installedVersion: '1.0.0-beta.2',
                        },
                    },
                    navigation: sourceNavigation(),
                },
            });
            expect(wrapper.get('h1').text()).toBe(title);
            expect(wrapper.get('#starting-environment').exists()).toBe(true);
            expect(wrapper.findAll('[data-demo-frame]')).toHaveLength(1);
            expect(wrapper.text()).toContain('Ready.');
            expect(wrapper.get('section[aria-labelledby="starting-environment"]').text()).toContain(
                '1.0.0-beta.2',
            );
            wrapper.unmount();
        },
    );

    it('indexes current public APIs and the Inertia publication limit at authored destinations', () => {
        const documents = extractDocumentation(
            guides.map(([file, slug, title]) => ({
                slug,
                title,
                description: 'Dapter Vue preview.',
                packageTitle: 'Dapter',
                sourcePath: `resources/js/pages/docs/dapter/${file}.vue`,
            })),
        );
        const section = (anchor) => documents.find((document) => document.anchor === anchor);
        expect(section('field-controls').body).toContain('Selected null is a value');
        expect(section('replace-reset').body).toContain('replaceState(snapshot)');
        expect(section('decode-definitions').body).toContain('decodeDefinition');
        expect(section('decode-definitions').body).toContain('never from row keys');
        expect(section('history').body).toContain('cannot be publicly canceled after dispatch');
        expect(section('scroll-container').body).toContain('no window fallback');
    });
});

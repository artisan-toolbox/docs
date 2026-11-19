import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import VectorSearch from '../../pages/docs/dapter/VectorSearch.vue';
import VueNavigation from '../../pages/docs/dapter/VueNavigation.vue';
import VectorResearch from '../../pages/docs/dapter/VectorResearch.vue';
import CodeExample from './CodeExample.vue';
import { sourceNavigation } from './sourceNavigationFixture';

const render = (component, slug, title) =>
    mount(component, {
        props: {
            page: {
                slug,
                title,
                description: 'Dapter local preview.',
                package: {
                    id: 'dapter',
                    title: 'Dapter',
                    stability: 'Beta',
                    installedVersion: '1.x-dev',
                },
            },
            navigation: sourceNavigation(),
        },
    });
describe('Dapter vector and saved-state contracts', () => {
    it('documents prepared exact-distance filtering through public code without an interactive vector demo', () => {
        const wrapper = render(
            VectorSearch,
            'dapter/vector-search',
            'Filter PostgreSQL vectors by distance',
        );
        expect(wrapper.get('section[aria-labelledby="starting-environment"]').text()).toContain(
            'pgvector already installed',
        );
        const code = wrapper
            .findAllComponents(CodeExample)
            .map((example) => example.props('code'))
            .join('\n');
        expect(code).toContain('new VectorOptions(');
        expect(code).toContain('dimensions: 3');
        expect(code).toContain('maxDistance: 1.0');
        expect(code).toContain(
            "catalog.fields.embedding.search.call({ value: [0, 0, 0], matchType: 'vector' })",
        );
        expect(wrapper.get('section[aria-labelledby="expected-result"]').text()).toContain(
            'does not rank nearest neighbors',
        );
        expect(wrapper.find('[data-demo-frame]').exists()).toBe(false);
        wrapper.unmount();
    });
    it('keeps historical ranking evidence separate from the delivered field filter', () => {
        const wrapper = render(
            VectorResearch,
            'dapter/research/vector-retrieval',
            'Vector retrieval research',
        );
        expect(wrapper.get('section[aria-labelledby="scope"]').text()).toContain(
            'public vector field filter',
        );
        expect(wrapper.get('section[aria-labelledby="results"]').text()).toContain(
            'neither a sealed token nor a Dapter cursor',
        );
        expect(wrapper.find('[data-research-scenario]').exists()).toBe(false);
        wrapper.unmount();
    });
    it('documents the fixed local lifetime, class version, safe restore, and side-effect-free share handle', () => {
        const wrapper = render(
            VueNavigation,
            'dapter/vue-navigation',
            'Save catalog navigation in the URL',
        );
        expect(wrapper.get('section[aria-labelledby="url-namespaces"]').text()).toContain(
            'saved_catalog.reading',
        );
        expect(wrapper.get('section[aria-labelledby="url-namespaces"]').text()).toContain(
            'second read',
        );
        expect(wrapper.get('section[aria-labelledby="expiration"]').text()).toContain(
            'do not renew',
        );
        expect(wrapper.get('section[aria-labelledby="expiration"]').text()).toContain(
            'package configuration do not change',
        );
        expect(wrapper.get('section[aria-labelledby="share"]').text()).toContain('catalog.share()');
        expect(wrapper.get('section[aria-labelledby="share"]').text()).toContain(
            'does not change browser history, storage, or the clipboard',
        );
        wrapper.unmount();
    });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import PageHeader from './PageHeader.vue';

describe('PageHeader', () => {
    it('renders the page title, description, and slotted introduction', () => {
        const wrapper = mount(PageHeader, {
            props: {
                title: 'Introduction',
                description: 'Tools for Laravel projects.',
            },
            slots: { default: '<p>Choose a package to get started.</p>' },
        });

        expect(wrapper.findAll('h1')).toHaveLength(1);
        expect(wrapper.get('h1').text()).toBe('Introduction');
        expect(wrapper.text()).toContain('Tools for Laravel projects.');
        expect(wrapper.text()).toContain('Choose a package to get started.');
    });

    it('keeps an accessible heading alongside the real light and dark wordmarks', () => {
        const wrapper = mount(PageHeader, {
            props: {
                title: 'Maintainer',
                description: 'Maintenance workflows.',
                artwork: {
                    light: '/maintainer-light.svg',
                    dark: '/maintainer-dark.svg',
                },
            },
        });

        expect(wrapper.get('h1').text()).toBe('Maintainer');
        expect(
            wrapper.findAll('img').map((image) => image.attributes('src')),
        ).toEqual(['/maintainer-light.svg', '/maintainer-dark.svg']);
        expect(
            wrapper.findAll('img').map((image) => image.attributes('alt')),
        ).toEqual(['', '']);
    });
});

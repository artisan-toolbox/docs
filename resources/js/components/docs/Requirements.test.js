import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Requirements from './Requirements.vue';

describe('Requirements', () => {
    it.each([
        [
            'Maintainer',
            ['PHP 8.5 or later within the PHP 8.x series', 'Composer', 'Git'],
        ],
        ['a Laravel package', ['PHP 8.3 or later', 'Laravel 12 or later']],
    ])('renders the requirements for %s', (_packageName, items) => {
        const wrapper = mount(Requirements, { props: { items } });

        expect(wrapper.get('h2').text()).toBe('Requirements');
        expect(wrapper.findAll('li').map((item) => item.text())).toEqual(items);
        expect(wrapper.get('section').attributes('aria-labelledby')).toBe(
            wrapper.get('h2').attributes('id'),
        );
    });

    it('renders explanatory content supplied through its slot', () => {
        const wrapper = mount(Requirements, {
            props: {
                items: ['Composer'],
                id: 'runtime',
                title: 'Runtime requirements',
            },
            slots: { default: '<p>Install these tools before continuing.</p>' },
        });

        expect(wrapper.get('h2').text()).toBe('Runtime requirements');
        expect(wrapper.get('h2').attributes('id')).toBe('runtime');
        expect(wrapper.get('p').text()).toBe(
            'Install these tools before continuing.',
        );
    });
});

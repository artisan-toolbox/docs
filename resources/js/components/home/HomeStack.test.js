import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import HomeStack from './HomeStack.vue';

describe('the documentation application tools', () => {
    it('links each named tool to its official site in a safe new tab', () => {
        const wrapper = mount(HomeStack);
        const links = wrapper.findAll('a');
        expect(links.map((link) => [link.text(), link.attributes('href')])).toEqual([
            ['Laravel', 'https://laravel.com'],
            ['Vue', 'https://vuejs.org'],
            ['Inertia', 'https://inertiajs.com'],
            ['Tailwind CSS', 'https://tailwindcss.com'],
            ['Pest', 'https://pestphp.com'],
        ]);
        for (const link of links) {
            expect(link.attributes('target')).toBe('_blank');
            expect(link.attributes('rel')).toBe('noopener noreferrer');
        }
        for (const name of ['pest', 'inertia']) {
            expect(wrapper.get(`site-icon-stub[name="${name}"]`).attributes('family')).toBe('kit');
        }
    });
});

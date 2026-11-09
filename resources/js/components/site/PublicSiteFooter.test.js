import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import PublicSiteFooter from './PublicSiteFooter.vue';

describe('public site footer', () => {
    it('keeps an icon and a readable label on every site destination', () => {
        const wrapper = mount(PublicSiteFooter, {
            props: {
                links: {
                    home: '/',
                    docs: '/docs',
                    github: 'https://github.com/artisan-toolbox',
                    contact: 'mailto:contact@atb.dev.br',
                },
            },
        });
        const links = wrapper.get('nav').findAll('a');
        expect(links.map((link) => link.text())).toEqual([
            'Home',
            'Documentation',
            'GitHub',
            'Contact',
        ]);
        expect(links.map((link) => link.get('site-icon-stub').attributes('name'))).toEqual([
            'house',
            'book-open',
            'github',
            'envelope',
        ]);
        expect(links[2].attributes('target')).toBe('_blank');
        expect(links[3].attributes('href')).toBe('mailto:contact@atb.dev.br');
    });
});

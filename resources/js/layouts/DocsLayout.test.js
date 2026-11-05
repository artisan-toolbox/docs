import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import DocsLayout from './DocsLayout.vue';

const { page } = vi.hoisted(() => ({
    page: {
        url: '/docs',
        props: {
            page: {
                sourceUrl:
                    'https://github.com/artisan-toolbox/docs/blob/main/src/content/docs/index.mdx',
                sourceLabel: 'View migration source on GitHub',
            },
            navigation: [
                { title: 'Introduction', href: '/docs', active: true },
                {
                    title: 'Maintainer',
                    href: '/docs/maintainer',
                    active: false,
                },
                {
                    title: 'Core',
                    href: 'https://artisantoolbox.wsssoftware.com.br/packages/core/',
                    active: false,
                },
            ],
        },
    },
}));

vi.mock('@inertiajs/vue3', async (importOriginal) => ({
    ...(await importOriginal()),
    usePage: () => page,
}));

afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
});

describe('DocsLayout', () => {
    it('toggles the mobile navigation and exposes the active page', async () => {
        const wrapper = mount(DocsLayout, {
            slots: { default: '<h1>Introduction</h1>' },
        });
        const menu = wrapper.get('button[aria-controls="docs-navigation"]');

        expect(menu.attributes('aria-expanded')).toBe('false');
        await menu.trigger('click');

        expect(menu.attributes('aria-expanded')).toBe('true');
        expect(wrapper.get('#docs-navigation').classes()).not.toContain(
            'hidden',
        );
        expect(wrapper.get('a[aria-current="page"]').text()).toBe(
            'Introduction',
        );
        expect(
            wrapper
                .get(
                    'a[href="https://artisantoolbox.wsssoftware.com.br/packages/core/"]',
                )
                .text(),
        ).toBe('Core');

        await menu.trigger('click');

        expect(menu.attributes('aria-expanded')).toBe('false');
        expect(wrapper.get('#docs-navigation').classes()).toContain('hidden');
    });

    it('applies and persists the selected theme through the existing appearance preference', async () => {
        const wrapper = mount(DocsLayout);

        await wrapper.get('select').setValue('dark');

        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('appearance')).toBe('dark');

        await wrapper.get('select').setValue('light');

        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('appearance')).toBe('light');

        await wrapper.get('select').setValue('system');

        expect(localStorage.getItem('appearance')).toBe('system');
    });

    it('renders the public brand, page content, skip link, and honest migration source label', () => {
        const wrapper = mount(DocsLayout, {
            slots: { default: '<h1>Introduction</h1>' },
        });

        expect(wrapper.get('main h1').text()).toBe('Introduction');
        expect(wrapper.get('a[href="#main-content"]').text()).toBe(
            'Skip to content',
        );
        expect(
            wrapper
                .findAll('header img')
                .map((image) => image.attributes('alt')),
        ).toEqual(['Artisan Toolbox', 'Artisan Toolbox']);
        expect(wrapper.get('footer a').text()).toContain(
            'View migration source on GitHub',
        );
        expect(wrapper.get('footer a').attributes('href')).toBe(
            page.props.page.sourceUrl,
        );
    });
});

import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vite-plus/test';
import DocsLink from './DocsLink.vue';

describe('DocsLink', () => {
    it.each(['http://example.com/guide', 'https://example.com/guide', '//example.com/guide'])(
        'opens an external web destination in a protected new tab for %s',
        (href) => {
            const wrapper = mount(DocsLink, { props: { href } });

            expect(wrapper.findComponent(Link).exists()).toBe(false);
            expect(wrapper.get('a').attributes()).toMatchObject({
                href,
                target: '_blank',
                rel: 'noopener noreferrer',
            });
        },
    );

    it('keeps root-relative application destinations on Inertia', () => {
        const wrapper = mount(DocsLink, {
            props: { href: '/docs/maintainer' },
        });

        expect(wrapper.findComponent(Link).exists()).toBe(true);
        expect(wrapper.get('a').attributes('target')).toBeUndefined();
        expect(wrapper.get('a').attributes('rel')).toBeUndefined();
    });

    it.each([
        '#installation',
        'maintainer',
        '../configuration',
        '?section=installation',
        `${window.location.origin}/docs/maintainer`,
        `//${window.location.host}/docs/maintainer`,
        'mailto:contact@atb.dev.br',
        'tel:+5511999999999',
    ])('keeps a native same-tab destination for %s', (href) => {
        const wrapper = mount(DocsLink, { props: { href } });

        expect(wrapper.findComponent(Link).exists()).toBe(false);
        expect(wrapper.get('a').attributes('href')).toBe(href);
        expect(wrapper.get('a').attributes('target')).toBeUndefined();
        expect(wrapper.get('a').attributes('rel')).toBeUndefined();
    });

    it('retains native attributes, classes, content, and click listeners', async () => {
        const onClick = vi.fn((event) => event.preventDefault());
        const wrapper = mount(DocsLink, {
            props: { href: '#installation' },
            attrs: {
                class: 'documentation-link',
                'aria-label': 'Read installation instructions',
                target: '_self',
                rel: 'help',
                onClick,
            },
            slots: { default: 'Installation' },
        });

        await wrapper.get('a').trigger('click');

        expect(wrapper.get('a').attributes()).toMatchObject({
            'aria-label': 'Read installation instructions',
            target: '_self',
            rel: 'help',
        });
        expect(wrapper.get('a').classes()).toContain('documentation-link');
        expect(wrapper.get('a').text()).toBe('Installation');
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('protects external tabs when caller attributes specify another target or opener', () => {
        const wrapper = mount(DocsLink, {
            props: { href: 'https://example.com/guide' },
            attrs: {
                target: '_self',
                rel: 'opener',
                class: 'documentation-link',
            },
        });

        expect(wrapper.get('a').attributes('target')).toBe('_blank');
        expect(wrapper.get('a').attributes('rel')).toBe('noopener noreferrer');
        expect(wrapper.get('a').classes()).toContain('documentation-link');
    });

    it('updates the navigation policy when its destination changes', async () => {
        const wrapper = mount(DocsLink, { props: { href: '/docs' } });

        await wrapper.setProps({ href: '//example.com/guide' });

        expect(wrapper.findComponent(Link).exists()).toBe(false);
        expect(wrapper.get('a').attributes('target')).toBe('_blank');

        await wrapper.setProps({ href: '#installation' });

        expect(wrapper.get('a').attributes('target')).toBeUndefined();
        expect(wrapper.get('a').attributes('rel')).toBeUndefined();
    });
});

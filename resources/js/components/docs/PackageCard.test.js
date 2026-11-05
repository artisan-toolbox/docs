import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import PackageCard from './PackageCard.vue';

describe('PackageCard', () => {
    it('uses Inertia navigation for a migrated package', () => {
        const wrapper = mount(PackageCard, {
            props: {
                package: {
                    id: 'maintainer',
                    title: 'Maintainer',
                    summary: 'Package maintenance workflows.',
                    version: '1.10',
                    href: '/docs/maintainer',
                    migrated: true,
                    artwork: {
                        icon: '/images/packages/maintainer/maintainer-icon.svg',
                    },
                },
            },
        });

        expect(wrapper.findComponent(Link).exists()).toBe(true);
        expect(wrapper.get('a').attributes('href')).toBe('/docs/maintainer');
        expect(wrapper.get('h3').text()).toBe('Maintainer');
        expect(wrapper.text()).toContain('v1.10');
        expect(wrapper.get('img').attributes('src')).toBe(
            '/images/packages/maintainer/maintainer-icon.svg',
        );
    });

    it('keeps an unmigrated package on the canonical legacy documentation', () => {
        const wrapper = mount(PackageCard, {
            props: {
                package: {
                    id: 'core',
                    title: 'Core',
                    summary: 'Shared package capabilities.',
                    version: null,
                    href: 'https://artisantoolbox.wsssoftware.com.br/packages/core/',
                    migrated: false,
                    artwork: { icon: '/images/packages/core/core-icon.svg' },
                },
            },
        });

        expect(wrapper.findComponent(Link).exists()).toBe(false);
        expect(wrapper.get('a').attributes('href')).toBe(
            'https://artisantoolbox.wsssoftware.com.br/packages/core/',
        );
        expect(wrapper.text()).toContain('In development');
    });
});

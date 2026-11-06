import { Link } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import PackageCard from './PackageCard.vue';

describe('PackageCard', () => {
    it('uses the installed Composer version as the documented version for releases and branches', async () => {
        const item = {
            id: 'core',
            title: 'Core',
            summary: 'Shared utilities.',
            version: '1.x',
            href: '/docs/core',
            migrated: true,
            artwork: { icon: '/core.svg' },
            installedVersion: '1.2.0',
            installationSource: 'composer',
        };
        const wrapper = mount(PackageCard, { props: { package: item } });

        expect(wrapper.text()).toContain('Documented version 1.2.0');
        expect(wrapper.text()).not.toContain('v1.x');
        await wrapper.setProps({
            package: {
                ...item,
                installedVersion: '1.x-dev',
                installationSource: 'local-path',
            },
        });
        expect(wrapper.text()).toContain('Documented version 1.x-dev');
        expect(wrapper.text()).not.toContain('Local preview');
    });

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
        expect(wrapper.text()).toContain('Documented version Not installed');
        expect(wrapper.text()).not.toContain('v1.10');
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
                    href: 'https://atb.dev.br/packages/core/',
                    migrated: false,
                    artwork: { icon: '/images/packages/core/core-icon.svg' },
                },
            },
        });

        expect(wrapper.findComponent(Link).exists()).toBe(false);
        expect(wrapper.get('a').attributes('href')).toBe(
            'https://atb.dev.br/packages/core/',
        );
        expect(wrapper.get('a').attributes('target')).toBe('_blank');
        expect(wrapper.get('a').attributes('rel')).toBe('noopener noreferrer');
        expect(wrapper.text()).toContain('Documented version Not installed');
    });
});

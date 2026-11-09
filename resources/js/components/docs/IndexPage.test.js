import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/Index.vue';

describe('Documentation catalog', () => {
    it('renders all supplied packages with the page heading and description', () => {
        const packages = [
            ['core', 'Core'],
            ['dump-to-console', 'Dump to Console'],
            ['front-awesome', 'Front Awesome'],
            ['maintainer', 'Maintainer'],
            ['mosaicast', 'Mosaicast'],
            ['qztray', 'QZ Tray Connector'],
        ].map(([id, title]) => ({
            id,
            title,
            summary: `${title} documentation.`,
            version: '1.x',
            href: id === 'maintainer' ? '/docs/maintainer' : `https://atb.dev.br/packages/${id}/`,
            migrated: id === 'maintainer',
            artwork: { icon: `/images/packages/${id}/${id}-icon.svg` },
        }));
        const wrapper = mount(Index, {
            props: {
                page: {
                    title: 'Documentation',
                    description:
                        'Practical guides for Artisan Toolbox Laravel packages and developer tools.',
                },
                packages,
            },
        });

        expect(wrapper.get('h1').text()).toBe('Documentation');
        expect(wrapper.text()).toContain(
            'Practical guides for Artisan Toolbox Laravel packages and developer tools.',
        );
        expect(wrapper.findAll('h3').map((heading) => heading.text())).toEqual([
            'Core',
            'Dump to Console',
            'Front Awesome',
            'Maintainer',
            'Mosaicast',
            'QZ Tray Connector',
        ]);
        expect(wrapper.get('a[href="/docs/maintainer"]').text()).toContain('Maintainer');
        expect(wrapper.get('a[href="https://atb.dev.br/packages/qztray/"]').text()).toContain(
            'QZ Tray Connector',
        );
    });
});

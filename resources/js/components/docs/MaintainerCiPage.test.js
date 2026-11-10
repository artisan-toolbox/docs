import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Ci from '../../pages/docs/maintainer/Ci.vue';

describe('Maintainer Code Quality overview', () => {
    it('preserves workflow selection, project tool isolation, public commands, and the detailed guide', async () => {
        const wrapper = mount(Ci, {
            props: {
                navigation: [
                    {
                        slug: 'maintainer',
                        title: 'Maintainer',
                        href: '/docs/maintainer',
                        active: false,
                        activeAncestor: false,
                        children: [
                            {
                                slug: 'maintainer/ci',
                                title: 'Code Quality',
                                href: '/docs/maintainer/ci',
                                active: false,
                                activeAncestor: false,
                                children: [
                                    {
                                        slug: 'maintainer/ci/quality',
                                        title: 'Fixes and CI Checks',
                                        href: '/docs/maintainer/ci/quality',
                                        active: false,
                                        activeAncestor: false,
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                page: {
                    title: 'Code Quality',
                    description:
                        "Run the consuming project's code-quality tools locally or in continuous integration.",
                    package: {
                        title: 'Maintainer',
                        composerName: 'artisan-toolbox/maintainer',
                        documentedVersion: '1.10',
                        installedVersion: '1.10',
                        stability: 'Stable',
                        artwork: {
                            light: '/images/packages/maintainer/maintainer-light.svg',
                            dark: '/images/packages/maintainer/maintainer-dark.svg',
                        },
                    },
                },
            },
        });
        const paragraphs = wrapper.findAll('p').map((paragraph) => paragraph.text());

        expect(wrapper.get('h1').text()).toBe('Code Quality');
        expect(wrapper.get('h1').find('.sr-only, img').exists()).toBe(false);
        expect(wrapper.find('dl').exists()).toBe(false);
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Maintainer');
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
            'Documented version 1.10',
        );
        expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Stable');
        expect(paragraphs).toContain(
            'The Code Quality group separates commands that modify files from checks intended for continuous integration. Open Code Quality from the interactive menu, choose Fix or CI Check, and then select from the commands configured for that workflow.',
        );
        expect(paragraphs).toContain(
            "Maintainer always runs the consuming project's binaries, configuration files, and package scripts. Dependencies bundled inside the Maintainer PHAR are isolated and are never used to analyze or modify the consuming project.",
        );
        expect(wrapper.get('li').text()).toBe(
            'Fixes and CI checks: install, configure, select, and run the supported tools.',
        );
        expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual([
            'vendor/bin/maintainer quality:check',
            'vendor/bin/maintainer quality:fix',
        ]);
        expect(
            wrapper
                .findAll('wa-button[aria-label^="Copy "]')
                .map((button) => button.attributes('aria-label')),
        ).toEqual(['Copy Run CI checks', 'Copy Run automated fixes']);
        expect(wrapper.findAll('a').map((link) => [link.text(), link.attributes('href')])).toEqual([
            ['Fixes and CI checks', '/docs/maintainer/ci/quality'],
            ['Fixes and CI checks guide', '/docs/maintainer/ci/quality'],
        ]);

        await wrapper.setProps({
            navigation: [
                {
                    slug: 'maintainer',
                    title: 'Maintainer',
                    href: '/docs/maintainer',
                    active: false,
                    activeAncestor: false,
                    children: [
                        {
                            slug: 'maintainer/ci',
                            title: 'Code Quality',
                            href: '/docs/maintainer/ci',
                            active: false,
                            activeAncestor: false,
                            children: [
                                {
                                    slug: 'maintainer/ci/quality',
                                    title: 'Fixes and CI Checks',
                                    href: '/reference/maintainer/ci/quality',
                                    active: false,
                                    activeAncestor: false,
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual([
            '/reference/maintainer/ci/quality',
            '/reference/maintainer/ci/quality',
        ]);
    });
});

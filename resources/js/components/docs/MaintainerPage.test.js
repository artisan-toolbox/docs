import { installationCommands } from './installationFixture';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Maintainer from '../../pages/docs/maintainer/Maintainer.vue';
import { expectLegacyLinks } from './front-awesome/legacyParity';

const allowedExtraLinks = [
    { slug: 'maintainer/installation', text: 'Install Maintainer' },
];

describe('Maintainer overview', () => {
    it('preserves every overview paragraph, heading, command, and guide destination', () => {
        const wrapper = mount(Maintainer, {
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
                                slug: 'maintainer/installation',
                                href: '/docs/maintainer/installation',
                                children: [],
                            },
                            {
                                slug: 'maintainer/versioning',
                                href: '/docs/maintainer/versioning',
                                children: [
                                    {
                                        slug: 'maintainer/versioning/project-integration',
                                        href: '/docs/maintainer/versioning/project-integration',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                slug: 'maintainer/configuration',
                                href: '/docs/maintainer/configuration',
                                children: [],
                            },
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
                    slug: 'maintainer',
                    title: 'Maintainer',
                    description:
                        'Automated validation, quality assurance, versioning, and release workflows.',
                    requirements: [
                        'PHP 8.5 or later within the PHP 8.x series',
                        'Composer',
                        'Git',
                        'GitHub CLI for workflows that interact with GitHub',
                    ],
                    package: {
                        installationCommands:
                            installationCommands('maintainer'),
                        id: 'maintainer',
                        title: 'Maintainer',
                        composerName: 'artisan-toolbox/maintainer',
                        documentedVersion: '1.10',
                        installedVersion: '1.x-dev',
                        installationStatus: 'installed',
                        installationSource: 'local-path',
                        stability: 'Stable',
                        repositoryUrl:
                            'https://github.com/artisan-toolbox/maintainer',
                        releasesUrl:
                            'https://packagist.org/packages/artisan-toolbox/maintainer',
                        artwork: {
                            light: '/images/packages/maintainer/maintainer-light.svg',
                            dark: '/images/packages/maintainer/maintainer-dark.svg',
                        },
                    },
                },
            },
        });
        const paragraphs = wrapper
            .findAll('p')
            .map((paragraph) => paragraph.text());

        expect(wrapper.get('h1').text()).toBe('Maintainer');
        expect(wrapper.findAll('dl dd').map((value) => value.text())).toEqual([
            'artisan-toolbox/maintainer',
            '1.x-dev',
            'Stable',
            'GitHub',
        ]);
        expect(
            wrapper
                .findAll('h2')
                .map((heading) => [heading.attributes('id'), heading.text()]),
        ).toEqual([
            ['requirements', 'Requirements'],
            ['installation', 'Installation'],
            ['open-the-menu', 'Open the menu'],
            ['common-workflows', 'Common workflows'],
            ['learn-more', 'Learn more'],
            ['source-and-releases', 'Source and releases'],
        ]);
        for (const paragraph of [
            'Maintainer provides a single entry point for repetitive package and application maintenance tasks, including validation, commits, versioning, changelogs, deployments, and GitHub releases.',
            'This guide covers Maintainer 1.10. If your version class still uses WithReadmeBadgeVersion, follow the README badge migration.',
            'Install Maintainer as a development dependency:',
            "The PHAR bundles Maintainer's CLI dependencies and keeps them separate from the project being maintained.",
            'Open its interactive menu:',
            'The menu groups commands by workflow. Run vendor/bin/maintainer list to see the available command names.',
            'Initialize project configuration:',
            "Maintainer's documentation follows the same groups as its interactive menu:",
            'Open a feature page for its requirements, configuration, examples, interactive behavior, automation behavior, and failure conditions.',
        ]) {
            expect(paragraphs).toContain(paragraph);
        }
        expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual([
            installationCommands('maintainer').composer.code,
            'vendor/bin/maintainer',
            'vendor/bin/maintainer config:publish',
        ]);
        expect(
            wrapper.findAll('section ul li').map((item) => item.text()),
        ).toEqual([
            'PHP 8.5 or later within the PHP 8.x series',
            'Composer',
            'Git',
            'GitHub CLI for workflows that interact with GitHub',
            'Code Quality: apply automated fixes and run PHP and frontend checks as configurable workflows.',
            'Configuration: publish templates and manage settings, secrets, and SSH keys.',
            'Deployment: run declared Deployer tasks, retry after unlock, and manage PM2 processes by application namespace.',
            'Versioning: review diffs, create commits, push pending branches, and publish GitHub releases.',
            'Command index',
            'Project integration',
            'Development and building',
            'Source code',
            'Packagist releases',
        ]);
        const legacyLinks = [
            [
                'README badge migration',
                '/docs/maintainer/versioning/project-integration#migrate-an-existing-version-badge',
            ],
            ['Code Quality', '/docs/maintainer/ci'],
            ['Configuration', '/docs/maintainer/configuration'],
            [
                'Deployment',
                'https://atb.dev.br/packages/maintainer/deployment/',
            ],
            ['Versioning', '/docs/maintainer/versioning'],
            [
                'Command index',
                'https://atb.dev.br/packages/maintainer/commands/',
            ],
            [
                'Project integration',
                '/docs/maintainer/versioning/project-integration',
            ],
            [
                'Development and building',
                'https://atb.dev.br/packages/maintainer/development/',
            ],
            ['Source code', 'https://github.com/artisan-toolbox/maintainer'],
            [
                'Packagist releases',
                'https://packagist.org/packages/artisan-toolbox/maintainer',
            ],
        ];
        const repositoryLink = wrapper.get(
            'a[aria-label="Maintainer repository on GitHub"]',
        );
        expect(repositoryLink.attributes('href')).toBe(
            'https://github.com/artisan-toolbox/maintainer',
        );
        expect(repositoryLink.attributes('target')).toBe('_blank');
        const contentLinks = wrapper
            .findAll('a')
            .filter((link) => link.element !== repositoryLink.element);
        expectLegacyLinks(
            contentLinks,
            legacyLinks.map(([, href]) => ({ href })),
            allowedExtraLinks,
        );
        expect(
            contentLinks
                .filter(
                    (link) =>
                        link.attributes('href') !==
                        '/docs/maintainer/installation',
                )
                .map((link) => [link.text(), link.attributes('href')]),
        ).toEqual(legacyLinks);
        const outboundLinks = wrapper.findAll('a[href^="https://"]');

        expect(outboundLinks).toHaveLength(6);
        for (const link of outboundLinks) {
            expect(link.attributes('target')).toBe('_blank');
            expect(link.attributes('rel')).toBe('noopener noreferrer');
        }
    });
});

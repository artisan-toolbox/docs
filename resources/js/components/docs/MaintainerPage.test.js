import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Maintainer from '../../pages/docs/maintainer/Maintainer.vue';

describe('Maintainer overview', () => {
    it('preserves every overview paragraph, heading, command, and guide destination', () => {
        const wrapper = mount(Maintainer, {
            props: {
                page: {
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
                        composerName: 'artisan-toolbox/maintainer',
                        documentedVersion: '1.10',
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
            '1.10',
            'Stable',
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
            'composer require --dev artisan-toolbox/maintainer:^1.10',
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
            'Deployment: run and unlock Deployer or attach shared repository and PM2 tasks.',
            'Versioning: review diffs, create commits, and publish GitHub releases.',
            'Command index',
            'Project integration',
            'Development and building',
            'Source code',
            'Packagist releases',
        ]);
        expect(
            wrapper
                .findAll('a')
                .map((link) => [link.text(), link.attributes('href')]),
        ).toEqual([
            [
                'README badge migration',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/project-integration/#migrate-an-existing-version-badge',
            ],
            [
                'Code Quality',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/ci/',
            ],
            [
                'Configuration',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/configuration/',
            ],
            [
                'Deployment',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/deployment/',
            ],
            [
                'Versioning',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/',
            ],
            [
                'Command index',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/commands/',
            ],
            [
                'Project integration',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/versioning/project-integration/',
            ],
            [
                'Development and building',
                'https://artisantoolbox.wsssoftware.com.br/packages/maintainer/development/',
            ],
            ['Source code', 'https://github.com/artisan-toolbox/maintainer'],
            [
                'Packagist releases',
                'https://packagist.org/packages/artisan-toolbox/maintainer',
            ],
        ]);
    });
});

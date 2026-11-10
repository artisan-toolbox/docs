import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/maintainer/configuration/Index.vue';
import Reference from '../../pages/docs/maintainer/configuration/Reference.vue';
import Publishing from '../../pages/docs/maintainer/configuration/Publishing.vue';
import SshKeys from '../../pages/docs/maintainer/configuration/SshKeys.vue';
const packageMetadata = {
    title: 'Maintainer',
    composerName: 'artisan-toolbox/maintainer',
    documentedVersion: '1.10',
    installedVersion: '1.10',
    stability: 'Stable',
    artwork: { light: '/logo-light.svg', dark: '/logo-dark.svg' },
};
const guideCases = [
    {
        component: Index,
        labels: ['Publish configuration'],
        languages: ['language-bash'],
        title: 'Configuration',
        slug: 'maintainer/configuration',
        headings: [],
        examples: ['vendor/bin/maintainer config:publish'],
    },
    {
        component: Reference,
        labels: [
            'Default Maintainer configuration',
            'Encrypt and decrypt a private key',
            'Configure environment variables',
            'Configure Maintainer secrets',
        ],
        languages: ['language-php', 'language-php', 'language-dotenv', 'language-php'],
        title: 'Configuration Reference',
        slug: 'maintainer/configuration/reference',
        headings: [
            ['encryption', 'Encryption'],
            ['environment-variables', 'Environment variables'],
            ['secrets', 'Secrets'],
            ['defaults-and-project-values', 'Defaults and project values'],
            ['legacy-json-configuration', 'Legacy JSON configuration'],
        ],
        examples: [
            String.raw`<?php

use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsRectorFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheckFix;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusTest;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsVueTscCheck;

return [
    'ai' => [
        'providers' => [
            'commit_message' => env('MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER', 'openai'),
            'release_type_suggestion' => env('MAINTAINER_AI_RELEASE_TYPE_SUGGESTION_PROVIDER', 'openai'),
            'release_notes' => env('MAINTAINER_AI_RELEASE_NOTES_PROVIDER', 'openai'),
            'release_changelog_update' => env('MAINTAINER_AI_RELEASE_CHANGELOG_UPDATE_PROVIDER', 'openai'),
        ],
    ],
    'git' => [
        'diff' => [
            'output_format' => env('MAINTAINER_GIT_DIFF_OUTPUT_FORMAT', 'line_by_line'),
        ],
    ],
    'quality' => [
        'fix' => [
            RunsRectorFix::class,
            RunsPintFix::class,
            RunsVitePlusCheckFix::class,
        ],
        'test' => [
            RunsPestCheck::class,
            RunsPintCheck::class,
            RunsVitePlusCheck::class,
            RunsVitePlusTest::class,
            RunsVueTscCheck::class,
            RunsPhpStanCheck::class,
        ],
        'pest' => [
            'parallel' => env('MAINTAINER_PEST_PARALLEL', false),
        ],
        'phpstan' => [
            'memory_limit' => env('MAINTAINER_PHPSTAN_MEMORY_LIMIT', '2G'),
        ],
    ],
];`,
            String.raw`use Illuminate\Support\Facades\Crypt;

$encrypted = Crypt::encryptString($privateKey);
$privateKey = Crypt::decryptString($encrypted);`,
            String.raw`MAINTAINER_AI_COMMIT_MESSAGE_PROVIDER=anthropic
MAINTAINER_GIT_DIFF_OUTPUT_FORMAT=side_by_side
MAINTAINER_PEST_PARALLEL=true
MAINTAINER_PHPSTAN_MEMORY_LIMIT=4G
APP_KEY=base64:your-32-byte-key-encoded-as-base64
OPENAI_API_KEY=your-api-key`,
            String.raw`<?php

return [
    'key' => env('APP_KEY'),
    'ssh_key' => null,
    // AI provider credentials...
];`,
        ],
    },
    {
        component: Publishing,
        labels: ['Publish configuration'],
        languages: ['language-bash'],
        title: 'Publish Configuration',
        slug: 'maintainer/configuration/publishing',
        headings: [
            ['select-templates', 'Select templates'],
            ['overwrite-protection', 'Overwrite protection'],
            ['secrets-and-ssh-identity', 'Secrets and SSH identity'],
            ['deployment-template', 'Deployment template'],
        ],
        examples: ['vendor/bin/maintainer config:publish'],
    },
    {
        component: SshKeys,
        labels: ['Display the private key', 'Display the public key', 'Use the SSH helpers'],
        languages: ['language-bash', 'language-bash', 'language-php'],
        title: 'SSH Keys',
        slug: 'maintainer/configuration/ssh-keys',
        headings: [
            ['generate-the-identity', 'Generate the identity'],
            ['display-the-keys', 'Display the keys'],
            ['use-the-helpers', 'Use the helpers'],
            ['use-the-identity-for-deployment', 'Use the identity for deployment'],
        ],
        examples: [
            String.raw`vendor/bin/maintainer ssh:key`,
            String.raw`vendor/bin/maintainer ssh:public`,
            String.raw`$privateKey = maintainer_ssh_key();
$publicKey = maintainer_ssh_public_key();`,
        ],
    },
];

function navigation(prefix = '/docs') {
    return [
        {
            slug: 'maintainer',
            href: `${prefix}/maintainer`,
            children: [
                {
                    slug: 'maintainer/configuration',
                    href: `${prefix}/maintainer/configuration`,
                    children: ['reference', 'publishing', 'ssh-keys'].map((slug) => ({
                        slug: `maintainer/configuration/${slug}`,
                        href: `${prefix}/maintainer/configuration/${slug}`,
                        children: [],
                    })),
                },
            ],
        },
    ];
}

function render(guide) {
    return mount(guide.component, {
        props: {
            page: {
                title: guide.title,
                description: 'Maintainer configuration guide.',
                package: packageMetadata,
            },
            navigation: navigation(),
        },
    });
}

describe('Maintainer Configuration guides', () => {
    for (const guide of guideCases) {
        it(`preserves ${guide.title} headings, anchors, every example, and visible guide metadata`, () => {
            const wrapper = render(guide);

            expect(wrapper.get('h1').text()).toBe(guide.title);
            expect(wrapper.get('h1').find('.sr-only, img').exists()).toBe(false);
            expect(wrapper.find('dl').exists()).toBe(false);
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Maintainer');
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain(
                'Documented version 1.10',
            );
            expect(wrapper.get('[aria-label="Package details"]').text()).toContain('Stable');
            expect(
                wrapper.findAll('h2').map((heading) => [heading.attributes('id'), heading.text()]),
            ).toEqual(guide.headings);
            expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual(guide.examples);
            expect(
                wrapper
                    .findAll('wa-button[aria-label^="Copy "]')
                    .map((button) => button.attributes('aria-label')),
            ).toEqual(guide.labels.map((label) => `Copy ${label}`));
            expect(
                wrapper
                    .findAll('pre code')
                    .map((code) => code.classes().find((name) => name.startsWith('language-'))),
            ).toEqual(guide.languages);
        });

        it(`updates ${guide.title} local guide links when route data changes`, async () => {
            const wrapper = render(guide);
            const before = wrapper.findAll('a').map((link) => link.attributes('href'));
            const local = before.filter((href) => href.startsWith('/docs/'));

            expect(local.length).toBeGreaterThan(0);
            await wrapper.setProps({ navigation: navigation('/reference') });

            expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                before.map((href) =>
                    href.startsWith('/docs/') ? href.replace('/docs/', '/reference/') : href,
                ),
            );
        });
    }

    it('keeps configuration group destinations local and deployment destinations on the published site', () => {
        expect(
            render(guideCases[0])
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toEqual([
            '/docs/maintainer/configuration/reference',
            '/docs/maintainer/configuration/publishing',
            '/docs/maintainer/configuration/ssh-keys',
        ]);
        expect(
            render(guideCases[2])
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toEqual([
            '/docs/maintainer/configuration/ssh-keys',
            'https://atb.dev.br/packages/maintainer/deployment/deploy/',
        ]);
        expect(
            render(guideCases[3])
                .findAll('a')
                .map((link) => link.attributes('href')),
        ).toEqual([
            '/docs/maintainer/configuration/reference#secrets',
            'https://atb.dev.br/packages/maintainer/deployment/deploy/#ssh-identity',
        ]);
    });

    it('preserves encryption, environment precedence, secret publishing, resolution, and legacy migration contracts', () => {
        const reference = render(guideCases[1]).text();
        for (const phrase of [
            'even when invoked from vendor/bin or another subdirectory',
            'Project configuration must use these contracts instead of the private App\\... implementation namespace.',
            'UseCheapestModel',
            'only when encryption or decryption is requested',
            'MissingAppKeyException',
            'Changing the key makes existing ciphertext unreadable.',
            'take precedence over values in that file',
            'not exported to quality tools, deployment commands, or other subprocesses',
            'does not read a custom key from an existing project secrets override',
            'without an SSH passphrase',
            'does not require the ssh-keygen executable',
            'rejected for text workflows with an actionable error',
            'ordered lists such as quality.fix and quality.test are replaced as complete values',
            'not part of the consuming project',
            'does not return an associative array',
            'maintainer.json and maintainer_secrets.json',
        ]) {
            expect(reference).toContain(phrase);
        }
    });

    it('preserves per-file overwrite protection and identity generation safety', () => {
        const text = render(guideCases[2]).text();
        for (const phrase of [
            'Only selected files are considered.',
            'suggests the value inferred from composer.json',
            'without PHAR compaction',
            'configurable dev_ prefix',
            'Overwriting defaults to no',
            'ARE YOU SURE',
            'Existing content and line endings are preserved',
            'entries are never duplicated',
            'requires a valid APP_KEY',
            'skips both the email prompt and SSH identity generation',
            'Key generation occurs only after overwrite approval.',
            'Declining an overwrite does not rotate the existing identity.',
            'project configuration, hosts, and hooks in the consuming project',
        ]) {
            expect(text).toContain(phrase);
        }
    });

    it('preserves private output warnings, helper failure conditions, encryption fallback, and temporary deployment lifecycle', () => {
        const text = render(guideCases[3]).text();
        for (const phrase of [
            'requested email as its comment',
            'does not read a custom key',
            'Without a stored identity, Deployer can use its own identity configuration.',
            'without persisting a second key value',
            'The private command writes sensitive material to standard output.',
            'without booting the Maintainer PHAR or starting a subprocess',
            'missing, malformed, or cannot be decrypted',
            "fall back to Laravel's app.key",
            'An explicitly configured null value does not use that fallback.',
            'When an encrypted Maintainer identity is configured',
            'restricted temporary file',
            'pass only its path to Deployer',
            'delete it after the process exits',
        ]) {
            expect(text).toContain(phrase);
        }
    });
});

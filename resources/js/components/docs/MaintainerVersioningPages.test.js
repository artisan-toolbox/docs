import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vite-plus/test';
import Index from '../../pages/docs/maintainer/versioning/Index.vue';
import Commits from '../../pages/docs/maintainer/versioning/Commits.vue';
import HtmlDiffs from '../../pages/docs/maintainer/versioning/HtmlDiffs.vue';
import Releases from '../../pages/docs/maintainer/versioning/Releases.vue';
import ProjectIntegration from '../../pages/docs/maintainer/versioning/ProjectIntegration.vue';

const guideCases = [
    {
        component: Index,
        title: 'Versioning',
        slug: 'maintainer/versioning',
        headings: [],
        examples: [],
        languages: [],
        labels: [],
    },
    {
        component: Commits,
        title: 'Create Commits',
        slug: 'maintainer/versioning/commits',
        headings: [
            [2, 'Review and select files', 'review-and-select-files'],
            [2, 'Write the message', 'write-the-message'],
            [2, 'Push the commit', 'push-the-commit'],
            [2, 'Push existing commits', 'push-existing-commits'],
        ],
        examples: [
            'vendor/bin/maintainer commit',
            'vendor/bin/maintainer push',
            'vendor/bin/maintainer push --branch=1.x --yes --no-interaction',
        ],
        languages: ['bash', 'bash', 'bash'],
        labels: ['Create a commit', 'Push existing commits', 'Push a named branch'],
    },
    {
        component: HtmlDiffs,
        title: 'HTML Git Diffs',
        slug: 'maintainer/versioning/html-diffs',
        headings: [
            [2, 'Output path and browser', 'output-path-and-browser'],
            [2, 'Layout', 'layout'],
        ],
        examples: [
            'vendor/bin/maintainer diff:html',
            'vendor/bin/maintainer diff:html 1.x\nvendor/bin/maintainer diff:html v1.0.0 v1.1.0',
            'vendor/bin/maintainer diff:html 1.x --output=artifacts/1.x-diff.html --no-open',
            "<?php\n\nreturn [\n    'git' => [\n        'diff' => [\n            'output_format' => 'side_by_side',\n        ],\n    ],\n];",
        ],
        languages: ['bash', 'bash', 'bash', 'php'],
        labels: [
            'Compare the working tree',
            'Compare Git references',
            'Save an HTML report',
            'Configure the diff layout',
        ],
    },
    {
        component: Releases,
        title: 'Create Releases',
        slug: 'maintainer/versioning/releases',
        headings: [
            [2, 'Requirements', 'requirements'],
            [2, 'Find the release baseline', 'find-the-release-baseline'],
            [2, 'Version transitions', 'version-transitions'],
            [2, 'Release workflow', 'release-workflow'],
            [2, 'AI context limits', 'ai-context-limits'],
            [2, 'Failure and rollback', 'failure-and-rollback'],
        ],
        examples: ['vendor/bin/maintainer release:create'],
        languages: ['bash'],
        labels: ['Create a release'],
    },
    {
        component: ProjectIntegration,
        title: 'Project Integration',
        slug: 'maintainer/versioning/project-integration',
        headings: [
            [2, 'Version class', 'version-class'],
            [2, 'Versioning hooks', 'versioning-hooks'],
            [2, 'Managed README header', 'managed-readme-header'],
            [3, 'Update the README locally', 'update-the-readme-locally'],
            [2, 'Migrate an existing version badge', 'migrate-an-existing-version-badge'],
        ],
        examples: [
            "<?php\n\nnamespace App;\n\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\AfterVersioning;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\BeforeVersioning;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\Versionable;\n\nfinal class ApplicationVersion implements Versionable, BeforeVersioning, AfterVersioning\n{\n    public const string VERSION = '1.0.0';\n\n    public static function beforeVersioning(string $current, string $next): void\n    {\n        // Prepare project-specific files for the selected version transition.\n    }\n\n    public static function afterVersioning(string $current, string $next): void\n    {\n        // Run project-specific follow-up after GitHub publishes the release.\n    }\n}",
            "<?php\n\nnamespace App;\n\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\Versionable;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Contracts\\WithReadmeHead;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Readme\\Badge;\nuse ArtisanToolbox\\Maintainer\\Versionable\\Readme\\Head;\n\nfinal class ApplicationVersion implements Versionable, WithReadmeHead\n{\n    public const string VERSION = '1.0.0';\n\n    public function readmeHead(): Head\n    {\n        return (new Head)\n            ->withLogo(src: 'assets/logo.svg', alt: 'Example logo', width: 96)\n            ->withTitle('Example')\n            ->withDescription([\n                '**Release tools** for Laravel projects.',\n                'Run `vendor/bin/maintainer` to open the menu.',\n            ])\n            ->appendDescriptionLine('See the [release notes](https://github.com/acme/example/releases).')\n            ->addBadge(Badge::releaseVersion('https://github.com/acme/example/releases'))\n            ->addBadge(Badge::make(\n                link: 'https://packagist.org/packages/acme/example',\n                imgSrc: 'https://img.shields.io/packagist/v/acme/example',\n                imgAlt: 'Packagist',\n            ));\n    }\n}",
            '<!-- MAINTAINER:README_HEAD:START -->\n<!-- MAINTAINER:README_HEAD:END -->',
            'vendor/bin/maintainer readme:update',
        ],
        languages: ['php', 'php', 'html', 'bash'],
        labels: [
            'Integrate versioning hooks',
            'Build the README header',
            'Mark the managed README header',
            'Update the README header',
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
                    children: [
                        {
                            slug: 'maintainer/configuration/reference',
                            href: `${prefix}/maintainer/configuration/reference`,
                            children: [],
                        },
                    ],
                },
                {
                    slug: 'maintainer/versioning',
                    href: `${prefix}/maintainer/versioning`,
                    children: ['commits', 'html-diffs', 'releases', 'project-integration'].map(
                        (slug) => ({
                            slug: `maintainer/versioning/${slug}`,
                            href: `${prefix}/maintainer/versioning/${slug}`,
                            children: [],
                        }),
                    ),
                },
            ],
        },
    ];
}

function render(guide) {
    return mount(guide.component, {
        props: {
            navigation: navigation(),
            page: {
                title: guide.title,
                description: 'Maintainer versioning guide.',
                package: {
                    title: 'Maintainer',
                    composerName: 'artisan-toolbox/maintainer',
                    documentedVersion: '1.10',
                    installedVersion: '1.10',
                    stability: 'Stable',
                },
            },
        },
    });
}

describe('Maintainer Versioning guides', () => {
    for (const guide of guideCases) {
        it(`preserves ${guide.title} headings, anchors, copyable examples, and visible metadata`, () => {
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
                wrapper
                    .findAll('h2, h3')
                    .map((heading) => [
                        Number(heading.element.tagName.slice(1)),
                        heading.text(),
                        heading.attributes('id'),
                    ]),
            ).toEqual(guide.headings);
            expect(wrapper.findAll('pre code').map((code) => code.text())).toEqual(guide.examples);
            expect(
                wrapper
                    .findAll('pre code')
                    .map((code) => code.classes().find((name) => name.startsWith('language-'))),
            ).toEqual(guide.languages.map((language) => `language-${language}`));
            expect(
                wrapper
                    .findAll('wa-button[aria-label^="Copy "]')
                    .map((button) => button.attributes('aria-label')),
            ).toEqual(guide.labels.map((label) => `Copy ${label}`));
        });
    }

    for (const guide of [guideCases[0], guideCases[1], guideCases[3]]) {
        it(`follows route-provided destinations in ${guide.title} after navigation data changes`, async () => {
            const wrapper = render(guide);
            const before = wrapper.findAll('a').map((link) => link.attributes('href'));

            expect(before.filter((href) => href.startsWith('/docs/')).length).toBeGreaterThan(0);
            await wrapper.setProps({ navigation: navigation('/reference') });

            expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(
                before.map((href) => href.replace('/docs/', '/reference/')),
            );
        });
    }

    it('keeps every Versioning group link local including the pending push anchor', () => {
        const wrapper = render(guideCases[0]);

        expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual([
            '/docs/maintainer/versioning/commits',
            '/docs/maintainer/versioning/commits#push-existing-commits',
            '/docs/maintainer/versioning/html-diffs',
            '/docs/maintainer/versioning/releases',
            '/docs/maintainer/versioning/project-integration',
        ]);
    });

    it('identifies pending push as part of Maintainer 1.11.0', () => {
        for (const guide of [guideCases[0], guideCases[1]]) {
            const text = render(guide).text();

            expect(text).toContain('Maintainer 1.11.0 includes');
        }
    });

    it('preserves complete-file staging, final message review, bounded AI context, and explicit branch push confirmation', () => {
        const wrapper = render(guideCases[1]);
        const text = wrapper.text();

        for (const phrase of [
            'The selection replaces the current staging-area selection.',
            'complete working-tree contents',
            'previously staged files that are not selected remain in the working tree but become unstaged',
            'ai.providers.commit_message',
            'All selected changes remain staged in full.',
            'The final commit message always opens in a multiline editor',
            'does not create a commit when no files are selected or when message generation fails',
            'The default is no, and pushing always requires confirmation.',
            'The workflow leaves your files, index, and checked-out branch intact.',
            'rather than an arbitrary subset of commits',
            'detached HEAD, missing origin, upstreams on another remote, and divergent histories',
            'one matching fetch and push URL',
            'extra push refspecs, and automatic tag pushes cannot expand the operation',
            'Concurrent remote updates, rewinds, deletions, and branch creation fail the push',
            'does not use custom remote.origin.uploadpack or remote.origin.receivepack commands',
        ]) {
            expect(text).toContain(phrase);
        }
        expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual([
            '/docs/maintainer/versioning/html-diffs',
            '/docs/maintainer/configuration/reference',
        ]);
    });

    it('preserves tracked-file comparisons, output resolution, supported layouts, and pinned report assets', () => {
        const text = render(guideCases[2]).text();

        for (const phrase of [
            'include staged and unstaged changes to tracked files',
            'Add new files to Git before generating the report',
            "operating system's temporary directory",
            'A relative output is resolved from the consuming project.',
            'appends .html when the filename has no HTML extension',
            'line_by_line or side_by_side',
            'diff2html 3.4.56 browser assets from jsDelivr',
        ]) {
            expect(text).toContain(phrase);
        }
    });

    it('preserves release prerequisites, transitions, generation, quality gates, and rollback boundaries', () => {
        const text = render(guideCases[3]).text();

        for (const phrase of [
            'a completely clean Git working tree',
            'production Composer PSR-4 or classmap autoloader',
            'authenticated GitHub CLI access',
            'ignores drafts and unsupported tags',
            'supporting shallow and --no-tags clones',
            'A prerelease line must become stable before another patch or minor begins.',
            'A major increment requires the matching new major branch.',
            'otherwise patch remains the default',
            'Laravel applications omit conventional AI-assistant instructions',
            'defaults to patch without asking AI',
            'The default answer is no.',
            'the exact release version, such as 1.2.0-beta.1',
            'rolls back the changes',
            'Automatic fixes run after CHANGELOG.md is written',
            'defaulting to yes',
            'restores the original worktree',
            'TAG - compact outcome',
            'a non-empty, single-line outcome of at most 100 characters',
            'Unknown AI hashes are discarded',
            'An invalid type aborts the release',
            'at most 24,000 characters, with no more than 16 fragments',
            'SIGTERM performs the same rollback and exits with status 143',
            'After a successful push, Maintainer does not attempt local rollback',
        ]) {
            expect(text).toContain(phrase);
        }
        expect(render(guideCases[3]).findAll('ol li')).toHaveLength(12);
    });

    it('preserves production autoload discovery, version contracts, hook timing, and README badge migration anchors', () => {
        const wrapper = render(guideCases[4]);
        const text = wrapper.text();

        for (const phrase of [
            "without exposing Maintainer's complete app/ directory",
            'directly in a production PSR-4 namespace',
            'Classes in nested PSR-4 namespaces and development-only autoload mappings are not considered.',
            'Declaring public const string VERSION is optional',
            'Other formats, including v prefixes, release candidates, build metadata, missing components, and leading zeros, are rejected.',
            'beforeVersioning($current, $next)',
            'after the release commit is pushed and the GitHub release is published',
            'instantiate without constructor arguments',
            'the same instance for chaining',
            'maintainer-title, maintainer-badges, and maintainer-description',
            'Maintainer escapes those values',
            'blocks unsafe link destinations',
            'descriptionLines()',
            'withLogo($src, $alt, $width = 160)',
            'incomplete, reversed, or duplicate markers',
            'accepts a dirty working tree',
            'without running the release hooks or creating a GitHub release',
            'A class that implements the removed interface fails to load on 1.9 and later.',
            'even when it is used only by development tooling. Do not move it to autoload-dev.',
            'install Maintainer as a regular dependency',
            'composer install --no-dev',
        ]) {
            expect(text).toContain(phrase);
        }
        expect(wrapper.get('#readme-version-badge').element.tagName).toBe('A');
        expect(wrapper.get('#migrate-an-existing-version-badge').text()).toBe(
            'Migrate an existing version badge',
        );
        expect(wrapper.get('#update-the-readme-locally').text()).toBe('Update the README locally');
        expect(wrapper.findAll('ol li')).toHaveLength(4);
    });
});

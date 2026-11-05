<?php

namespace App\Documentation;

/**
 * @phpstan-type Artwork array{light: string, dark: string, icon: string}
 * @phpstan-type Package array{id: string, title: string, summary: string, version: ?string, href: string, migrated: bool, artwork: Artwork}
 * @phpstan-type Overview array{id: string, title: string, composerName: string, documentedVersion: string, stability: string, repositoryUrl: string, releasesUrl: string, artwork: Artwork}
 * @phpstan-type Page array{slug: string, component: string, title: string, description: string, sourceUrl: string, sourceLabel: string, package: ?Overview, requirements: list<string>}
 */
final class Documentation
{
    private const PACKAGES = [
        'core' => ['title' => 'Core', 'summary' => 'Build conditional arrays, translate model attributes, and share Laravel and Inertia utilities.', 'version' => '1.x'],
        'dump-to-console' => ['title' => 'Dump to Console', 'summary' => 'Send Laravel dumps to a separate console without changing the application response.', 'version' => '1.x'],
        'front-awesome' => ['title' => 'Front Awesome', 'summary' => 'Use Web Awesome components, share Tailwind branding, and send toasts from Laravel or Vue.', 'version' => null],
        'maintainer' => ['title' => 'Maintainer', 'summary' => 'Run quality checks, create releases, and automate project maintenance.', 'version' => '1.x'],
        'mosaicast' => ['title' => 'Mosaicast', 'summary' => 'Deliver Laravel events through Inertia props or a private session broadcast channel.', 'version' => '1.x'],
        'qztray' => ['title' => 'QZ Tray Connector', 'summary' => 'Print through QZ Tray and preview ESC/POS receipts, ZPL labels, and PDFs.', 'version' => '1.x'],
    ];

    private const PAGES = [
        '' => [
            'component' => 'docs/Index',
            'title' => 'Documentation',
            'description' => 'Practical guides for Artisan Toolbox Laravel packages and developer tools.',
            'source' => 'src/content/docs/packages/index.mdx',
            'packageId' => null,
        ],
        'maintainer' => [
            'component' => 'docs/maintainer/Maintainer',
            'title' => self::PACKAGES['maintainer']['title'],
            'description' => 'Automated validation, quality assurance, versioning, and release workflows.',
            'source' => 'src/content/docs/packages/maintainer/index.md',
            'packageId' => 'maintainer',
        ],
    ];

    private const OVERVIEWS = [
        'maintainer' => [
            'documentedVersion' => '1.10',
            'stability' => 'Stable',
            'requirements' => [
                'PHP 8.5 or later within the PHP 8.x series',
                'Composer',
                'Git',
                'GitHub CLI for workflows that interact with GitHub',
            ],
        ],
    ];

    /** @return Page */
    public function page(string $slug): array
    {
        abort_unless(isset(self::PAGES[$slug]), 404);

        $definition = self::PAGES[$slug];
        $id = $definition['packageId'];
        $overview = $id === null ? null : self::OVERVIEWS[$id];

        return [
            'slug' => $slug,
            'component' => $definition['component'],
            'title' => $definition['title'],
            'description' => $definition['description'],
            'sourceUrl' => config()->string('documentation.source_url').'/'.$definition['source'],
            'sourceLabel' => 'View migration source on GitHub',
            'package' => $id === null ? null : [
                'id' => $id,
                'title' => self::PACKAGES[$id]['title'],
                'composerName' => 'artisan-toolbox/'.$id,
                'documentedVersion' => $overview['documentedVersion'],
                'stability' => $overview['stability'],
                'repositoryUrl' => 'https://github.com/artisan-toolbox/'.$id,
                'releasesUrl' => 'https://packagist.org/packages/artisan-toolbox/'.$id,
                'artwork' => $this->artwork($id),
            ],
            'requirements' => $overview['requirements'] ?? [],
        ];
    }

    /** @return list<Package> */
    public function packages(): array
    {
        $packages = [];

        foreach (self::PACKAGES as $id => $package) {
            $migrated = isset(self::PAGES[$id]);
            $packages[] = [
                'id' => $id,
                ...$package,
                'href' => $migrated
                    ? route('docs.show', ['slug' => $id], absolute: false)
                    : config()->string('documentation.url').'/packages/'.$id.'/',
                'migrated' => $migrated,
                'artwork' => $this->artwork($id),
            ];
        }

        return $packages;
    }

    /** @return list<array{title: string, href: string, active: bool}> */
    public function navigation(string $currentSlug): array
    {
        $navigation = [];

        foreach (self::PAGES as $slug => $page) {
            $navigation[] = [
                'title' => $page['title'],
                'href' => $slug === ''
                    ? route('docs.index', absolute: false)
                    : route('docs.show', ['slug' => $slug], absolute: false),
                'active' => $slug === $currentSlug,
            ];
        }

        return $navigation;
    }

    /** @return Artwork */
    private function artwork(string $id): array
    {
        $base = '/images/packages/'.$id.'/'.$id;

        return ['light' => $base.'-light.svg', 'dark' => $base.'-dark.svg', 'icon' => $base.'-icon.svg'];
    }
}

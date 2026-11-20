<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('serves the scrollbar guide and relocates the shared theme fragment', function () {
    $guide = PageSlug::FrontAwesomeScrollbar;

    $this->withoutVite()->get($guide->url())->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/front-awesome/Scrollbar')
        ->where('page.title', 'Style a scrollbar')
    );

    $this->withoutVite()->get(PageSlug::FrontAwesomeSharedTheme->url())->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('page.fragmentDestinations.style-a-scrollbar', $guide->url().'#style-a-scrollbar')
    );
});

function packageGuideSlugs(string $package): array
{
    $navigation = resolve(Documentation::class)->navigation(PageSlug::Index);
    $node = collect($navigation)->firstWhere('slug', $package);

    return array_map(fn ($child): string => $child->slug, $node->children);
}

test('starts each package journey with an installation guide', function () {
    $documentation = resolve(Documentation::class);
    $navigation = collect($documentation->navigation(PageSlug::Index))->keyBy('slug');

    foreach ($documentation->packages() as $package) {
        $installation = $package->id.'/installation';

        expect($navigation->get($package->id)?->children[0]->slug)->toBe($installation);
        $this->withoutVite()->get('/docs/'.$installation)->assertOk()->assertInertia(fn (Assert $page) => $page
            ->where('page.requirements.0', fn (string $requirement): bool => str_starts_with($requirement, 'PHP 8.5 minimum')
                && str_contains($requirement, 'tested on PHP 8.5 and 8.6'))
        );
    }
});

test('orders package guides by learning prerequisites rather than their titles', function (string $package, array $guides) {
    expect(packageGuideSlugs($package))->toBe(array_map(fn (string $guide): string => $package.'/'.$guide, $guides));
})->with([
    'maintainer' => ['maintainer', ['installation', 'configuration', 'ci', 'versioning', 'deployment', 'commands', 'development']],
    'core' => ['core', ['installation', 'conditional-arrays', 'multi-domain-inertia', 'translated-attributes']],
    'filoquent' => ['filoquent', ['installation', 'files', 'middleware', 'assets', 'configuration', 'health', 'garbage-collection', 'storage', 'rename-owners', 'development']],
    'dump-to-console' => ['dump-to-console', ['installation', 'usage']],
    'mosaicast' => ['mosaicast', ['installation', 'vue-plugin', 'inertia-delivery', 'session-channels', 'roadmap']],
    'front-awesome' => ['front-awesome', ['installation', 'web-awesome', 'setup', 'localization', 'preferences', 'styling', 'toasts', 'printing', 'data-view', 'user-permission-editor', 'development']],
    'qztray' => ['qztray', ['installation', 'security', 'connection', 'printing', 'escpos-writer', 'escpos-previews', 'zpl-previews', 'pdf-previews', 'compatibility', 'frontend-tooling', 'development']],
]);

test('places setup and inspection before their dependent maintainer actions', function () {
    $maintainer = collect(resolve(Documentation::class)->navigation(PageSlug::Maintainer))->firstWhere('slug', 'maintainer');
    $configuration = collect($maintainer->children)->firstWhere('slug', 'maintainer/configuration');
    $versioning = collect($maintainer->children)->firstWhere('slug', 'maintainer/versioning');

    expect(array_column($configuration->children, 'slug'))->toBe([
        'maintainer/configuration/publishing',
        'maintainer/configuration/reference',
        'maintainer/configuration/ssh-keys',
    ]);
    expect(array_column($versioning->children, 'slug'))->toBe([
        'maintainer/versioning/project-integration',
        'maintainer/versioning/html-diffs',
        'maintainer/versioning/commits',
        'maintainer/versioning/releases',
    ]);
});

test('groups Front Awesome by reader tasks while keeping published guide slugs', function () {
    $frontAwesome = collect(resolve(Documentation::class)->navigation(PageSlug::FrontAwesome))->firstWhere('slug', 'front-awesome');
    $groups = [
        'front-awesome/web-awesome' => ['front-awesome/web-awesome/components'],
        'front-awesome/web-awesome/components' => array_map(fn (string $group): string => 'front-awesome/web-awesome/components/'.$group, ['actions', 'forms', 'layout', 'navigation', 'feedback', 'media', 'data-viz', 'helpers']),
        'front-awesome/web-awesome/components/actions' => [],
        'front-awesome/web-awesome/components/forms' => [],
        'front-awesome/web-awesome/components/layout' => [],
        'front-awesome/web-awesome/components/media' => [],
        'front-awesome/setup' => ['front-awesome/vue-plugin', 'front-awesome/configuration'],
        'front-awesome/styling' => ['front-awesome/shared-theme', 'front-awesome/branding', 'front-awesome/scrollbar', 'front-awesome/primevue', 'front-awesome/theme-maintenance'],
        'front-awesome/toasts' => ['front-awesome/toasts/laravel', 'front-awesome/toasts/vue'],
        'front-awesome/localization' => ['front-awesome/localization/reference'],
        'front-awesome/printing' => ['front-awesome/printing/reference'],
    ];
    $childrenBySlug = [];
    $inspect = function (array $nodes) use (&$inspect, &$childrenBySlug): void {
        foreach ($nodes as $node) {
            $childrenBySlug[$node->slug] = array_column($node->children, 'slug');
            $inspect($node->children);
        }
    };

    $inspect($frontAwesome->children);

    foreach ($groups as $slug => $children) {
        expect($childrenBySlug[$slug])->toBe($children);
    }
});

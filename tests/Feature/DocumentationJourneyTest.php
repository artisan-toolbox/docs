<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;

function packageGuideSlugs(string $package): array
{
    $navigation = resolve(Documentation::class)->navigation(PageSlug::Index);
    $node = collect($navigation)->firstWhere('slug', $package);

    return array_map(fn ($child): string => $child->slug, $node->children);
}

test('starts each package journey with an installation guide', function () {
    foreach (resolve(Documentation::class)->packages() as $package) {
        $children = packageGuideSlugs($package->id);

        expect($children[0])->toBe($package->id.'/installation');
        $this->withoutVite()->get('/docs/'.$children[0])->assertOk();
    }
});

test('orders package guides by learning prerequisites rather than their titles', function (string $package, array $guides) {
    expect(packageGuideSlugs($package))->toBe(array_map(fn (string $guide): string => $package.'/'.$guide, $guides));
})->with([
    'maintainer' => ['maintainer', ['installation', 'configuration', 'ci', 'versioning', 'deployment', 'commands', 'development']],
    'core' => ['core', ['installation', 'conditional-arrays', 'multi-domain-inertia', 'translated-attributes']],
    'dump-to-console' => ['dump-to-console', ['installation', 'usage']],
    'mosaicast' => ['mosaicast', ['installation', 'vue-plugin', 'inertia-delivery', 'session-channels', 'roadmap']],
    'front-awesome' => ['front-awesome', ['installation', 'web-awesome', 'vue-plugin', 'configuration', 'button', 'page', 'toasts/laravel', 'toasts/vue', 'shared-theme', 'branding', 'primevue', 'theme-maintenance', 'development']],
    'qztray' => ['qztray', ['installation', 'security', 'connection', 'printing', 'escpos-previews', 'zpl-previews', 'pdf-previews', 'compatibility', 'frontend-tooling', 'development']],
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

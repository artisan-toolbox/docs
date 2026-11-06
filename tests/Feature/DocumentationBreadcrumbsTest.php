<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

test('shares breadcrumbs that follow the registered navigation for every documentation page', function (PageSlug $slug) {
    $this->withoutVite();
    $documentation = resolve(Documentation::class);
    $expected = [
        ['label' => 'Home', 'href' => '/', 'current' => false],
        ['label' => 'Documentation', 'href' => '/docs', 'current' => $slug === PageSlug::Index],
    ];
    $appendActivePath = function (array $nodes) use (&$appendActivePath, &$expected): void {
        foreach ($nodes as $node) {
            if ($node->slug !== '' && ($node->active || $node->activeAncestor)) {
                $expected[] = ['label' => $node->title, 'href' => $node->href, 'current' => $node->active];
                $appendActivePath($node->children);
            }
        }
    };
    $appendActivePath($documentation->navigation($slug));

    $this->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('page.breadcrumbs', $expected)
    );
})->with(PageSlug::cases());

test('orders deep registered ancestors before the current guide', function () {
    expect(resolve(Documentation::class)->breadcrumbs(PageSlug::MaintainerQuality))->toBe([
        ['label' => 'Home', 'href' => '/', 'current' => false],
        ['label' => 'Documentation', 'href' => '/docs', 'current' => false],
        ['label' => 'Maintainer', 'href' => '/docs/maintainer', 'current' => false],
        ['label' => 'Code Quality', 'href' => '/docs/maintainer/ci', 'current' => false],
        ['label' => 'Fixes and CI Checks', 'href' => '/docs/maintainer/ci/quality', 'current' => true],
    ]);
});

test('skips unregistered path segments instead of inventing breadcrumb pages', function () {
    $breadcrumbs = resolve(Documentation::class)->breadcrumbs(PageSlug::FrontAwesomeToastsVue);

    expect(array_column($breadcrumbs, 'href'))->toBe([
        '/', '/docs', '/docs/front-awesome', '/docs/front-awesome/toasts/vue',
    ])->and(array_column($breadcrumbs, 'current'))->toBe([false, false, false, true]);
});

test('generates breadcrumbs from renamed routes and the configured application origin', function () {
    Route::getRoutes()->getByName('home')->setUri('welcome');
    Route::getRoutes()->getByName('docs.index')->setUri('guides');
    Route::getRoutes()->getByName('docs.show')->setUri('guides/{slug}');
    config(['app.url' => 'https://documentation.example']);
    URL::forceRootUrl(config()->string('app.url'));
    URL::forceScheme('https');
    $documentation = resolve(Documentation::class);

    expect(array_column($documentation->breadcrumbs(PageSlug::CoreInstallation), 'href'))->toBe([
        '/welcome', '/guides', '/guides/core', '/guides/core/installation',
    ])->and(array_column($documentation->breadcrumbs(PageSlug::CoreInstallation, absolute: true), 'href'))->toBe([
        'https://documentation.example/welcome',
        'https://documentation.example/guides',
        'https://documentation.example/guides/core',
        'https://documentation.example/guides/core/installation',
    ]);
});

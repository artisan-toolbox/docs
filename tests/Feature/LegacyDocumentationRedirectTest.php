<?php

use App\Documentation\PageSlug;
use Illuminate\Support\Facades\Route;

test('redirects every registered legacy page to its named documentation route', function () {
    foreach (PageSlug::cases() as $slug) {
        $legacy = $slug === PageSlug::Index ? '/packages' : '/packages/'.$slug->value;

        $this->get($legacy)->assertStatus(301)->assertRedirect($slug->url(absolute: false));
    }
});

test('keeps legacy redirects attached to named routes when documentation paths change', function () {
    Route::getRoutes()->getByName('docs.index')->setUri('/reference');
    Route::getRoutes()->getByName('docs.show')->setUri('/reference/{slug}');

    foreach (PageSlug::cases() as $slug) {
        $legacy = $slug === PageSlug::Index ? '/packages' : '/packages/'.$slug->value;

        $this->get($legacy)->assertStatus(301)->assertRedirect($slug->url(absolute: false));
    }
});

test('does not turn unknown legacy paths into documentation redirects', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/packages/not-a-package', '/packages/maintainer/unknown', '/packages/app/Providers/AppServiceProvider.php']);

test('preserves the historical compatibility and project integration aliases', function () {
    $this->get('/packages/qztray/v1-readiness')->assertStatus(301)->assertRedirect('/docs/qztray/compatibility');
    $this->get('/packages/maintainer/project-integration')->assertStatus(301)->assertRedirect('/docs/maintainer/versioning/project-integration');
});

test('preserves the published community destinations and trailing slashes', function () {
    $destinations = [
        '/getting-started' => PageSlug::GettingStarted,
        '/getting-started/choose-a-package' => PageSlug::ChoosePackage,
        '/project' => PageSlug::Project,
        '/project/documentation-policy' => PageSlug::ProjectDocumentationPolicy,
        '/project/versioning' => PageSlug::ProjectVersioning,
        '/packages/qztray/v1-readiness' => PageSlug::QzTrayCompatibility,
        '/packages/maintainer/project-integration' => PageSlug::MaintainerVersioningProjectIntegration,
    ];

    foreach (PageSlug::cases() as $slug) {
        $path = $slug === PageSlug::Index ? '/packages' : '/packages/'.$slug->value;
        $destinations[$path] = $slug;
    }

    foreach ($destinations as $legacy => $slug) {
        foreach ([$legacy, $legacy.'/'] as $path) {
            $this->get($path)->assertStatus(301)->assertRedirect($slug->url(absolute: false));
        }
    }
});

<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Composer\InstalledVersions;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia as Assert;

test('registers Filoquent beta status with installation before reference and development', function () {
    $this->withoutVite();
    $version = InstalledVersions::getPrettyVersion('artisan-toolbox/filoquent');

    $this->get('/docs/filoquent')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/Index')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.stability', 'Beta')
        ->where('page.package.documentedVersion', '1.0.0-beta.3')
        ->where('page.package.installedVersion', $version)
        ->where('page.package.installationSource', 'composer')
        ->where('page.package.installationCommands.composer.code', 'composer require artisan-toolbox/filoquent:'.$version)
        ->where('page.package.artwork.icon', '/images/packages/filoquent/filoquent-icon.svg')
    );

    $node = collect(resolve(Documentation::class)->navigation(PageSlug::Index))->firstWhere('slug', 'filoquent');
    expect(array_column($node->children, 'slug'))->toBe([
        'filoquent/installation', 'filoquent/files', 'filoquent/middleware', 'filoquent/configuration', 'filoquent/health', 'filoquent/garbage-collection', 'filoquent/storage', 'filoquent/rename-owners', 'filoquent/development',
    ]);

    foreach (['installation', 'files', 'middleware', 'configuration', 'health', 'garbage-collection', 'storage', 'rename-owners', 'development'] as $slug) {
        $this->get('/docs/filoquent/'.$slug)->assertOk();
    }

    $this->get('/docs/filoquent/missing')->assertNotFound();
    $this->get('/packages/filoquent/installation')->assertRedirect('/docs/filoquent/installation');
});

test('registers the health audit as a discoverable guide before cleanup', function () {
    $this->withoutVite()->get('/docs/filoquent/health')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/Health')
        ->where('page.title', 'Check stored file health')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.stability', 'Beta')
    );

    expect(PageSlug::FiloquentHealth->parent())->toBe(PageSlug::Filoquent);
});

test('installs the published Filoquent status command used by the documentation', function () {
    expect(version_compare(InstalledVersions::getPrettyVersion('artisan-toolbox/filoquent'), '1.0.0-beta.3', '>='))->toBeTrue()
        ->and(Artisan::call('help', ['command_name' => 'filoquent:status']))->toBe(0)
        ->and(Artisan::output())->toContain('filoquent:status', '--connection');
});

test('renders Filoquent metadata through the shared server head', function () {
    $response = $this->withoutVite()->get('/docs/filoquent/installation')->assertOk();
    $document = new DOMDocument;
    @$document->loadHTML($response->getContent());
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toContain('Install Filoquent')
        ->and($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toEndWith('/docs/filoquent/installation')
        ->and($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))->toContain('Install Filoquent from Packagist');
});

test('registers owner rename guidance under the shared package ancestry', function () {
    $this->withoutVite()->get('/docs/filoquent/rename-owners')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/RenameOwners')
        ->where('page.title', 'Rename file owners safely')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.stability', 'Beta')
    );

    expect(PageSlug::FiloquentRenameOwners->parent())->toBe(PageSlug::Filoquent);
});

test('registers upload middleware as a task guide under the shared package ancestry', function () {
    $this->withoutVite()->get('/docs/filoquent/middleware')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/Middleware')
        ->where('page.title', 'Create upload middleware')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.documentedVersion', '1.0.0-beta.3')
    );

    expect(PageSlug::FiloquentMiddleware->parent())->toBe(PageSlug::Filoquent);
});

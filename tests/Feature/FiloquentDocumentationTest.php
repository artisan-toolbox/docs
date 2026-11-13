<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('registers the published Filoquent alpha with installation before reference and development', function () {
    $this->withoutVite();

    $this->get('/docs/filoquent')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/Index')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.stability', 'Alpha')
        ->where('page.package.documentedVersion', '1.0.0-alpha.1')
        ->where('page.package.installedVersion', '1.0.0-alpha.1')
        ->where('page.package.installationSource', 'composer')
        ->where('page.package.installationCommands.composer.code', 'composer require artisan-toolbox/filoquent:1.0.0-alpha.1')
        ->where('page.package.artwork.icon', '/images/packages/filoquent/filoquent-icon.svg')
    );

    $node = collect(resolve(Documentation::class)->navigation(PageSlug::Index))->firstWhere('slug', 'filoquent');
    expect(array_column($node->children, 'slug'))->toBe([
        'filoquent/installation', 'filoquent/files', 'filoquent/configuration', 'filoquent/health', 'filoquent/garbage-collection', 'filoquent/storage', 'filoquent/rename-owners', 'filoquent/development',
    ]);

    foreach (['installation', 'files', 'configuration', 'health', 'garbage-collection', 'storage', 'rename-owners', 'development'] as $slug) {
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
        ->where('page.package.stability', 'Alpha')
    );

    expect(PageSlug::FiloquentHealth->parent())->toBe(PageSlug::Filoquent);
});

test('renders Filoquent metadata through the shared server head', function () {
    $response = $this->withoutVite()->get('/docs/filoquent/installation')->assertOk();
    $document = new DOMDocument;
    @$document->loadHTML($response->getContent());
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toContain('Install Filoquent')
        ->and($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toEndWith('/docs/filoquent/installation')
        ->and($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))->toContain('alpha release from Packagist');
});

test('registers owner rename guidance under the shared package ancestry', function () {
    $this->withoutVite()->get('/docs/filoquent/rename-owners')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/filoquent/RenameOwners')
        ->where('page.title', 'Rename file owners safely')
        ->where('page.package.id', 'filoquent')
        ->where('page.package.stability', 'Alpha')
    );

    expect(PageSlug::FiloquentRenameOwners->parent())->toBe(PageSlug::Filoquent);
});

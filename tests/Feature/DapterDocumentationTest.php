<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('registers the Dapter preview with installation before development', function () {
    $this->withoutVite()->get('/docs/dapter')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/dapter/Index')
        ->where('page.package.id', 'dapter')
        ->where('page.package.stability', 'Work in progress')
        ->where('page.package.installedVersion', null)
        ->where('page.package.artwork.icon', '/images/packages/dapter/dapter-icon.svg')
    );

    $node = collect(resolve(Documentation::class)->navigation(PageSlug::Index))->firstWhere('slug', 'dapter');
    expect(array_column($node->children, 'slug'))->toBe(['dapter/installation', 'dapter/development']);
    expect(PageSlug::DapterInstallation->parent())->toBe(PageSlug::Dapter);
    expect(PageSlug::DapterDevelopment->parent())->toBe(PageSlug::Dapter);
    $this->get('/docs/dapter/installation')->assertOk();
    $this->get('/docs/dapter/development')->assertOk();
    $this->get('/packages/dapter')->assertRedirect('/docs/dapter');
    $this->get('/docs/dapter/missing')->assertNotFound();
});

test('provides an explicit local preview install before the vendor frontend install', function () {
    $this->withoutVite()->get('/docs/dapter/installation')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('page.package.installationCommands.local-preview.code', 'composer config repositories.dapter path ../dapter'."\n".'composer require artisan-toolbox/dapter:"1.x-dev@dev"')
        ->where('page.package.installationCommands.frontend.code', 'npm install --install-links ./vendor/artisan-toolbox/dapter')
    );
});

<?php

use App\Documentation\Documentation;
use App\Documentation\InstallationCommands;
use App\Documentation\PageSlug;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('shows Permit beta stability and installs the published release', function () {
    $version = InstallationCommands::composerVersion('artisan-toolbox/permit');

    $this->withoutVite()->get('/docs/permit')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/permit/Index')
        ->where('page.package.id', 'permit')
        ->where('page.package.stability', 'Beta')
        ->where('page.package.documentedVersion', '1.0.0-beta.3')
        ->where('page.package.installedVersion', $version)
        ->where('page.package.installationStatus', 'installed')
        ->where('page.package.installationCommands.composer.code', 'composer require artisan-toolbox/permit:'.$version)
        ->missing('page.package.installationCommands.local-preview')
        ->where('page.package.artwork.icon', '/images/packages/permit/permit-icon.svg')
    );
});

test('places Permit installation before task guides and development in the shared navigation', function () {
    $navigation = resolve(Documentation::class)->navigation(PageSlug::PermitInstallation);
    $permit = collect($navigation)->firstWhere('slug', 'permit');

    expect(array_column($permit->children, 'slug'))->toBe([
        'permit/installation',
        'permit/declarations',
        'permit/authorization',
        'permit/management',
        'permit/vue',
        'permit/operations',
        'permit/development',
    ])->and($permit->activeAncestor)->toBeTrue()
        ->and(PageSlug::PermitInstallation->parent())->toBe(PageSlug::Permit)
        ->and(PageSlug::PermitDevelopment->parent())->toBe(PageSlug::Permit);
});

test('serves Permit task guides and preserves the public package redirect', function (string $guide, string $component) {
    $this->withoutVite()->get('/docs/permit/'.$guide)->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/permit/'.$component)
        ->where('page.package.id', 'permit')
    );

    $this->get('/packages/permit/'.$guide)->assertRedirect('/docs/permit/'.$guide);
})->with([
    ['installation', 'Installation'],
    ['declarations', 'Declarations'],
    ['authorization', 'Authorization'],
    ['management', 'Management'],
    ['vue', 'Vue'],
    ['operations', 'Operations'],
    ['development', 'Development'],
]);

test('rejects unregistered Permit guide paths', function () {
    $this->withoutVite()->get('/docs/permit/permissions')->assertNotFound();
});

test('shares Permit decisions for signed in readers and keeps the editor on fictional accounts', function () {
    $this->withoutVite()->actingAs(User::factory()->create());

    $this->get('/docs/permit/management')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('permitAbilities.user_permissions::read', false)
        ->where('userPermissionEditor.endpoint', '/demo/front-awesome/permission-editor')
    );
    $this->getJson('/permit/user-permissions')->assertNotFound();
});

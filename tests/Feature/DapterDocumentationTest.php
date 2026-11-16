<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('registers the Dapter preview with installation before the roadmap and development', function () {
    $this->withoutVite()->get('/docs/dapter')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/dapter/Index')
        ->where('page.package.id', 'dapter')
        ->where('page.package.stability', 'Work in progress')
        ->where('page.package.installedVersion', '1.x-dev')
        ->where('page.package.artwork.icon', '/images/packages/dapter/dapter-icon.svg')
    );

    $node = collect(resolve(Documentation::class)->navigation(PageSlug::Index))->firstWhere('slug', 'dapter');
    expect(array_column($node->children, 'slug'))->toBe(['dapter/installation', 'dapter/sources', 'dapter/source-boundaries', 'dapter/listing', 'dapter/options', 'dapter/access', 'dapter/composable', 'dapter/authority', 'dapter/protocol', 'dapter/roadmap', 'dapter/design', 'dapter/development']);
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
        ->where('page.package.installationCommands.frontend.code', "npm pkg set 'dependencies.@artisan-toolbox/dapter=file:vendor/artisan-toolbox/dapter'\nnpm install --install-links")
    );
});

test('serves the Dapter proposal through the registered documentation route', function () {
    $this->withoutVite()->get(route('docs.show', ['slug' => 'dapter/roadmap']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/dapter/Roadmap')
            ->where('page.slug', 'dapter/roadmap')
            ->where('page.title', 'Dapter roadmap')
            ->where('page.description', 'Dapter architecture, delivery phases, and verified progress. The initial local offset listing slice is implemented; remaining APIs are proposed.')
            ->where('page.sourceUrl', config()->string('documentation.source_url').'/resources/js/pages/docs/dapter/Roadmap.vue')
            ->where('page.package.id', 'dapter')
        );

    expect(PageSlug::DapterRoadmap->parent())->toBe(PageSlug::Dapter);

    $response = $this->get('/docs/dapter/roadmap')->assertOk();
    $document = new DOMDocument;
    @$document->loadHTML($response->getContent());
    $xpath = new DOMXPath($document);
    expect($xpath->evaluate('string(//head/title)'))->toBe('Dapter roadmap - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toContain('Dapter architecture', 'remaining APIs are proposed');
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/dapter/roadmap');
});

test('registers focused source paging option access and composable guides', function () {
    $this->withoutVite();
    foreach ([
        'dapter/sources' => 'Sources',
        'dapter/source-boundaries' => 'SourceBoundaries',
        'dapter/listing' => 'Listing',
        'dapter/options' => 'Options',
        'dapter/access' => 'Access',
        'dapter/access/gates' => 'Gates',
        'dapter/composable' => 'Composable',
        'dapter/authority' => 'Authority',
        'dapter/protocol' => 'Protocol',
        'dapter/protocol/errors' => 'Errors',
    ] as $slug => $component) {
        $this->get(route('docs.show', ['slug' => $slug]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('docs/dapter/'.$component)
            ->where('page.slug', $slug)
            ->where('page.package.id', 'dapter')
        );
    }
    expect(PageSlug::from('dapter/access/gates')->parent())->toBe(PageSlug::from('dapter/access'));
    expect(PageSlug::DapterAuthority->parent())->toBe(PageSlug::Dapter);
    expect(PageSlug::DapterSourceBoundaries->parent())->toBe(PageSlug::Dapter);
    expect(PageSlug::DapterDesignSourceBoundaries->parent())->toBe(PageSlug::DapterDesign);
    $this->get('/docs/dapter/design/source-boundaries')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/dapter/design/SourceBoundaries')
        ->where('page.slug', 'dapter/design/source-boundaries')
    );
    expect(PageSlug::DapterProtocol->parent())->toBe(PageSlug::Dapter);
    expect(PageSlug::DapterProtocolErrors->parent())->toBe(PageSlug::DapterProtocol);
});

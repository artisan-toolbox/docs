<?php

use App\Documentation\Documentation;
use App\Documentation\InstallationCommands;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('registers the Dapter preview with installation before the roadmap and development', function () {
    $this->withoutVite()->get('/docs/dapter')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/dapter/Index')
        ->where('page.package.id', 'dapter')
        ->where('page.package.stability', 'Work in progress')
        ->where('page.package.installedVersion', '1.0.0-alpha.1')
        ->where('page.package.artwork.icon', '/images/packages/dapter/dapter-icon.svg')
    );

    $node = collect(resolve(Documentation::class)->navigation(PageSlug::Index))->firstWhere('slug', 'dapter');
    expect(array_column($node->children, 'slug'))->toBe(['dapter/installation', 'dapter/sources', 'dapter/listing', 'dapter/vue-controls', 'dapter/field-search', 'dapter/field-filters', 'dapter/field-order', 'dapter/actions', 'dapter/resources', 'dapter/live-updates', 'dapter/authority', 'dapter/development']);
    expect(PageSlug::DapterInstallation->parent())->toBe(PageSlug::Dapter);
    foreach ([PageSlug::DapterResources, PageSlug::DapterLiveAuthorization, PageSlug::DapterLiveUpdates, PageSlug::DapterRevisionRaces, PageSlug::DapterPolling] as $guide) {
        expect($guide->parent())->toBe(in_array($guide, [PageSlug::DapterLiveAuthorization, PageSlug::DapterRevisionRaces, PageSlug::DapterPolling], true) ? PageSlug::DapterLiveUpdates : PageSlug::Dapter);
        $this->get($guide->url(false))->assertOk();
    }
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
        ->where('page.package.installationCommands.ziggy.code', 'composer require tightenco/ziggy:'.InstallationCommands::composerVersion('tightenco/ziggy'))
    );
});

test('serves the Dapter proposal through the registered documentation route', function () {
    $this->withoutVite()->get(route('docs.show', ['slug' => 'dapter/roadmap']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/dapter/Roadmap')
            ->where('page.slug', 'dapter/roadmap')
            ->where('page.title', 'Dapter roadmap')
            ->where('page.description', 'Verified Dapter preview phases, source-owned literal search, native paging and live behavior, with completed vector and snapshot research and explicit public API deferrals.')
            ->where('page.sourceUrl', config()->string('documentation.source_url').'/resources/js/pages/docs/dapter/Roadmap.vue')
            ->where('page.package.id', 'dapter')
        );

    expect(PageSlug::DapterRoadmap->parent())->toBe(PageSlug::DapterDevelopment);

    $response = $this->get('/docs/dapter/roadmap')->assertOk();
    $document = new DOMDocument;
    @$document->loadHTML($response->getContent());
    $xpath = new DOMXPath($document);
    expect($xpath->evaluate('string(//head/title)'))->toBe('Dapter roadmap - Artisan Toolbox');
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toContain('source-owned literal search', 'completed vector and snapshot research and explicit public API deferrals');
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/dapter/roadmap');
});

test('registers focused source paging option access and composable guides', function () {
    $this->withoutVite();
    foreach ([
        'dapter/sources' => 'Sources',
        'dapter/source-boundaries' => 'SourceBoundaries',
        'dapter/listing' => 'Listing',
        'dapter/simple-paging' => 'SimplePaging',
        'dapter/cursor-paging' => 'CursorPaging',
        'dapter/cursor-recovery' => 'CursorRecovery',
        'dapter/paging-counts' => 'PagingCounts',
        'dapter/options' => 'Options',
        'dapter/field-search' => 'FieldSearch',
        'dapter/field-order' => 'FieldOrder',
        'dapter/collection-comparisons' => 'CollectionComparisons',
        'dapter/field-filters' => 'FieldFilters',
        'dapter/typed-filters' => 'TypedFilters',
        'dapter/field-declarations' => 'FieldDeclarations',
        'dapter/global-search' => 'GlobalSearch',
        'dapter/literal-search' => 'LiteralSearch',
        'dapter/literal-search/configuration' => 'LiteralConfiguration',
        'dapter/research' => 'Research',
        'dapter/research/vector-retrieval' => 'VectorResearch',
        'dapter/research/pagination-consistency' => 'SnapshotResearch',
        'dapter/global-filters' => 'GlobalFilters',
        'dapter/enum-inputs' => 'EnumInputs',
        'dapter/handler-requirements' => 'HandlerRequirements',
        'dapter/composed-declarations' => 'ComposedDeclarations',
        'dapter/multi-order' => 'MultiOrder',
        'dapter/advanced-queries' => 'AdvancedQueries',
        'dapter/postgresql-full-text' => 'PostgresqlFullText',
        'dapter/comparison-capabilities' => 'ComparisonCapabilities',
        'dapter/actions' => 'Actions',
        'dapter/action-declarations' => 'ActionDeclarations',
        'dapter/action-outcomes' => 'ActionOutcomes',
        'dapter/access' => 'Access',
        'dapter/access/gates' => 'Gates',
        'dapter/composable' => 'Composable',
        'dapter/vue-controls' => 'VueControls',
        'dapter/vue-definitions' => 'VueDefinitions',
        'dapter/vue-navigation' => 'VueNavigation',
        'dapter/authority' => 'Authority',
        'dapter/protocol' => 'Protocol',
        'dapter/protocol/v2' => 'ProtocolV2',
        'dapter/source-registration' => 'SourceRegistration',
        'dapter/protocol/errors' => 'Errors',
        'dapter/design/fixtures' => 'design/Fixtures',
    ] as $slug => $component) {
        $this->get(route('docs.show', ['slug' => $slug]))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('docs/dapter/'.$component)
            ->where('page.slug', $slug)
            ->where('page.package.id', 'dapter')
        );
    }
    expect(PageSlug::from('dapter/access/gates')->parent())->toBe(PageSlug::from('dapter/access'));
    expect(PageSlug::DapterAuthority->parent())->toBe(PageSlug::Dapter);
    expect(PageSlug::DapterSourceBoundaries->parent())->toBe(PageSlug::DapterSources);
    expect(PageSlug::DapterDesignSourceBoundaries->parent())->toBe(PageSlug::DapterDesign);
    $this->get('/docs/dapter/design/source-boundaries')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/dapter/design/SourceBoundaries')
        ->where('page.slug', 'dapter/design/source-boundaries')
    );
    expect(PageSlug::DapterProtocol->parent())->toBe(PageSlug::DapterAuthority);
    expect(PageSlug::DapterProtocolErrors->parent())->toBe(PageSlug::DapterProtocol);
    expect(PageSlug::DapterDesignFixtures->parent())->toBe(PageSlug::DapterDesign);
});

test('keeps literal configuration and research guides under their owning task pages', function () {
    expect(PageSlug::DapterLiteralConfiguration->parent())->toBe(PageSlug::DapterLiteralSearch)
        ->and(PageSlug::DapterVectorResearch->parent())->toBe(PageSlug::DapterResearch)
        ->and(PageSlug::DapterSnapshotResearch->parent())->toBe(PageSlug::DapterResearch);
    $node = collect(resolve(Documentation::class)->navigation(PageSlug::DapterVectorResearch))->firstWhere('slug', 'dapter');
    $development = collect($node->children)->firstWhere('slug', 'dapter/development');
    $research = collect($development->children)->firstWhere('slug', 'dapter/research');
    expect(array_column($research->children, 'slug'))->toBe(['dapter/research/vector-retrieval', 'dapter/research/pagination-consistency']);
});

test('groups every existing Dapter guide by task without losing routes or ancestry', function () {
    $expectedRoots = ['installation', 'sources', 'listing', 'vue-controls', 'field-search', 'field-filters', 'field-order', 'actions', 'resources', 'live-updates', 'authority', 'development'];
    $slugs = array_values(array_filter(PageSlug::cases(), fn (PageSlug $slug): bool => $slug === PageSlug::Dapter || str_starts_with($slug->value, 'dapter/')));
    expect($slugs)->toHaveCount(63);
    foreach ($slugs as $slug) {
        $visited = [];
        for ($ancestor = $slug; $ancestor !== null; $ancestor = $ancestor->parent()) {
            expect($visited)->not->toContain($ancestor->value);
            $visited[] = $ancestor->value;
        }
    }
    $navigation = resolve(Documentation::class)->navigation(PageSlug::DapterLiteralConfiguration);
    $dapter = collect($navigation)->firstWhere('slug', 'dapter');
    expect(array_column($dapter->children, 'slug'))->toBe(array_map(fn (string $slug): string => 'dapter/'.$slug, $expectedRoots));
    $pending = [$dapter];
    $actual = [];
    $activeAncestors = [];
    while ($pending !== []) {
        $node = array_pop($pending);
        $actual[] = $node->slug;
        if ($node->activeAncestor) {
            $activeAncestors[] = $node->slug;
        }
        array_push($pending, ...$node->children);
    }
    expect($actual)->toHaveCount(63)->and(array_unique($actual))->toHaveCount(63);
    sort($actual);
    $expected = array_map(fn (PageSlug $slug): string => $slug->value, $slugs);
    sort($expected);
    expect($actual)->toBe($expected)
        ->and($activeAncestors)->toBe(['dapter', 'dapter/field-search', 'dapter/literal-search']);
    expect(array_column(resolve(Documentation::class)->breadcrumbs(PageSlug::DapterLiteralConfiguration), 'href'))
        ->toBe(['/', '/docs', '/docs/dapter', '/docs/dapter/field-search', '/docs/dapter/literal-search', '/docs/dapter/literal-search/configuration']);
    $this->withoutVite();
    foreach ($slugs as $slug) {
        $this->get($slug->url(false))->assertOk();
    }
});

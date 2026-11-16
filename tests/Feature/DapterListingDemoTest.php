<?php

use App\Demo\Dapter\Listing\DemoConfiguration;
use App\Demo\Dapter\Listing\FixtureProducts;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

function dapterListingCases(): array
{
    return json_decode(file_get_contents(__DIR__.'/../../app/Demo/Dapter/Listing/coverage.json'), true, flags: JSON_THROW_ON_ERROR)['cases'];
}

function dapterListingRequest(int $page = 1, int $size = 5): array
{
    return [
        'version' => 1,
        'state' => [
            'version' => 1,
            'fields' => new stdClass,
            'global' => new stdClass,
            'searchMatch' => 'all',
            'order' => ['kind' => 'default'],
            'paging' => ['mode' => 'offset', 'current' => $page, 'per_page' => $size],
        ],
    ];
}

beforeEach(function () {
    DemoConfiguration::register();
    config([
        'dapter.access.guard' => 'dapter-demo-guest',
        'dapter.paging.mode' => PagingMode::Offset,
        'dapter.paging.per_page' => 10,
        'dapter.paging.per_page_options' => [5, 10, 50, 100],
    ]);
});

test('runs every registered listing declaration through the actual package route', function (array $case) {
    $defaultGuard = Auth::getDefaultDriver();
    $response = $this->postJson(route('dapter.data', ['source' => $case['source']]), ['version' => 1]);
    $response->assertStatus($case['expected']['status']);

    if ($case['expected']['status'] !== 200) {
        $response->assertJsonPath('version', 1)->assertJsonPath('error.kind', 'access');
        expect($response->json())->not->toHaveKeys(['data', 'paging', 'capabilities']);
    } else {
        $size = $case['expected']['per_page'];
        $response->assertJsonCount($size, 'data')
            ->assertJsonPath('data.0', FixtureProducts::rows()[0])
            ->assertJsonPath('paging.current', 1)
            ->assertJsonPath('paging.pages', (int) ceil(23 / $size))
            ->assertJsonPath('paging.total', 23)
            ->assertJsonPath('paging.filtered', 23)
            ->assertJsonPath('paging.per_page', $size)
            ->assertJsonPath('capabilities.paging.per_page_options', $case['expected']['options'])
            ->assertJsonPath('state.order.kind', 'source');

        foreach ($case['expected']['options'] as $allowedSize) {
            $this->postJson(route('dapter.data', ['source' => $case['source']]), dapterListingRequest(size: $allowedSize))
                ->assertOk()
                ->assertJsonCount(min(23, $allowedSize), 'data')
                ->assertJsonPath('paging.per_page', $allowedSize)
                ->assertJsonPath('capabilities.paging.per_page', $case['expected']['per_page']);
        }
    }

    expect(Auth::getDefaultDriver())->toBe($defaultGuard);
    expect(Auth::guard('web')->check())->toBeFalse();
})->with(fn (): array => array_combine(
    array_column(dapterListingCases(), 'id'),
    array_map(fn (array $case): array => [$case], dapterListingCases()),
));

test('reads config defaults at resolution and uses the selected configured guard', function () {
    config([
        'dapter.access.guard' => 'dapter-demo',
        'dapter.paging.mode' => PagingMode::Offset,
        'dapter.paging.per_page' => 8,
        'dapter.paging.per_page_options' => [4, 8],
    ]);

    $this->postJson(route('dapter.data', ['source' => 'Dapter.CollectionDefaults']), ['version' => 1])
        ->assertOk()
        ->assertJsonCount(8, 'data')
        ->assertJsonPath('paging.mode', 'offset')
        ->assertJsonPath('capabilities.paging.per_page_options', [4, 8]);

    config(['dapter.access.guard' => 'missing-dapter-demo-guard']);
    $this->postJson(route('dapter.data', ['source' => 'Dapter.CollectionDefaults']), ['version' => 1])
        ->assertStatus(500)
        ->assertJsonPath('error.kind', 'server');
});

test('pages the real collection and SQLite sources with identical observable results', function (string $source) {
    $url = route('dapter.data', ['source' => $source]);
    $this->postJson($url, dapterListingRequest(2, 5))
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('data.0.name', 'Notebook 06')
        ->assertJsonPath('data.4.name', 'Notebook 10')
        ->assertJsonPath('paging.current', 2)
        ->assertJsonPath('paging.has_previous', true)
        ->assertJsonPath('paging.has_next', true);

    $this->postJson($url, dapterListingRequest(999, 10))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('data.0.name', 'Notebook 21')
        ->assertJsonPath('requested.paging.current', 3)
        ->assertJsonPath('paging.current', 3)
        ->assertJsonPath('paging.has_next', false);

    $this->postJson($url, ['version' => 1])
        ->assertOk()->assertJsonPath('paging.current', 1)->assertJsonPath('paging.per_page', 5);
})->with(['Dapter.CollectionFluent', 'Dapter.SqliteProducts']);

test('rejects unavailable sizes and unsupported search without returning fictional success', function () {
    $url = route('dapter.data', ['source' => 'Dapter.CollectionFluent']);
    $this->postJson($url, dapterListingRequest(size: 7))
        ->assertUnprocessable()->assertJsonPath('error.kind', 'validation');

    $request = dapterListingRequest();
    $request['state']['global'] = (object) ['search' => 'Notebook'];
    $this->postJson($url, $request)
        ->assertUnprocessable()->assertJsonPath('error.kind', 'unsupported_operation');
});

test('generates and executes the documented source-only collection without app records', function () {
    $path = app_path('DataSources/Dapter/GeneratedCatalog.php');
    expect(File::exists($path))->toBeFalse();

    try {
        $this->artisan('make:datasource', ['name' => 'Dapter.GeneratedCatalog'])
            ->expectsOutputToContain('Data source created.')
            ->assertSuccessful();
        expect(File::get($path))->toContain('class GeneratedCatalog', 'source()');
        config(['dapter.access.guard' => 'dapter-demo']);

        $this->postJson(route('dapter.data', ['source' => 'Dapter.GeneratedCatalog']), ['version' => 1])
            ->assertOk()
            ->assertJsonPath('data', [])
            ->assertJsonPath('paging.total', 0)
            ->assertJsonPath('paging.current', 1)
            ->assertJsonPath('paging.pages', 1);
    } finally {
        File::delete($path);
    }
});

test('generates the Eloquent scaffold and executes it after declaring its actual SQLite source', function () {
    $path = app_path('DataSources/Dapter/GeneratedSqliteCatalog.php');
    expect(File::exists($path))->toBeFalse();

    try {
        $this->artisan('make:datasource', ['name' => 'Dapter.GeneratedSqliteCatalog', '--eloquent' => true])
            ->expectsOutputToContain('Data source created.')
            ->assertSuccessful();
        $scaffold = File::get($path);
        expect($scaffold)->toContain('extends EloquentDataSource', 'Implement source() with your application model query');
        File::put($path, str_replace(
            "throw new LogicException('Implement source() with your application model query before reading this source.');",
            'return \\App\\Demo\\Dapter\\Listing\\SqliteFixture::query();',
            $scaffold,
        ));
        config(['dapter.access.guard' => 'dapter-demo']);

        $this->postJson(route('dapter.data', ['source' => 'Dapter.GeneratedSqliteCatalog']), ['version' => 1])
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.name', 'Notebook 01')
            ->assertJsonPath('paging.total', 23);
    } finally {
        File::delete($path);
    }
});

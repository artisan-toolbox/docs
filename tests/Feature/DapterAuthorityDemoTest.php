<?php

use App\Demo\Dapter\Listing\DemoConfiguration;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;

function dapterAuthorityPayload(int $page = 1, int $size = 10): array
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

test('keeps the source definition when accepting a reader page size', function () {
    $url = route('dapter.data', ['source' => 'Dapter.CollectionFluent']);
    $this->postJson($url, dapterAuthorityPayload())
        ->assertOk()
        ->assertJsonCount(10, 'data')
        ->assertJsonPath('data.0.name', 'Notebook 01')
        ->assertJsonPath('data.9.name', 'Notebook 10')
        ->assertJsonPath('requested.paging.per_page', 10)
        ->assertJsonPath('state.paging.per_page', 10)
        ->assertJsonPath('paging.total', 23)
        ->assertJsonPath('capabilities.paging.per_page', 5)
        ->assertJsonPath('capabilities.paging.per_page_options', [5, 10])
        ->assertJsonPath('capabilities.fields', []);

    $this->postJson($url, ['version' => 1])
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('paging.per_page', 5);
});

test('returns stable errors for the fixed tampered requests without a partial result', function (string $mutation, string $kind, string $code) {
    $request = dapterAuthorityPayload(size: $mutation === 'size' ? 7 : 5);
    if ($mutation === 'field') {
        $request['state']['fields'] = (object) ['name' => (object) ['search' => 'Notebook']];
    }
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.CollectionFluent']), $request)
        ->assertUnprocessable()
        ->assertJsonPath('error.kind', $kind)
        ->assertJsonPath('error.code', $code)
        ->assertJsonPath('errors._dapter_kind', [$kind]);

    expect($response->json())->not->toHaveKeys(['data', 'requested', 'state', 'paging', 'capabilities']);

    $this->postJson(route('dapter.data', ['source' => 'Dapter.CollectionFluent']), dapterAuthorityPayload())
        ->assertOk()->assertJsonCount(10, 'data');
})->with([
    'undeclared size' => ['size', 'validation', 'invalid_request'],
    'undeclared field' => ['field', 'unsupported_operation', 'unsupported_operation'],
]);

test('acknowledges an out of range page with its bounded effective position', function () {
    $this->postJson(route('dapter.data', ['source' => 'Dapter.CollectionFluent']), dapterAuthorityPayload(999))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('data.0.name', 'Notebook 21')
        ->assertJsonPath('data.2.name', 'Notebook 23')
        ->assertJsonPath('requested.paging.current', 3)
        ->assertJsonPath('state.paging.current', 3)
        ->assertJsonPath('paging.current', 3)
        ->assertJsonPath('paging.pages', 3);
});

test('rejects the same tampered requests before any SQLite source query and executes a later valid read', function (string $mutation) {
    $queries = [];
    DB::listen(function (QueryExecuted $event) use (&$queries): void {
        if ($event->connectionName === 'dapter-listing-demo') {
            $queries[] = $event->sql;
        }
    });
    $request = dapterAuthorityPayload(size: $mutation === 'size' ? 7 : 5);
    if ($mutation === 'field') {
        $request['state']['fields'] = (object) ['name' => (object) ['search' => 'Notebook']];
    }
    $url = route('dapter.data', ['source' => 'Dapter.SqliteProducts']);
    $this->postJson($url, $request)->assertUnprocessable();
    expect($queries)->toBeEmpty();

    $this->postJson($url, dapterAuthorityPayload())->assertOk()->assertJsonCount(10, 'data');
    expect($queries)->not->toBeEmpty();
    expect(implode("\n", $queries))->toContain('count(*)', 'limit 10');
})->with(['size', 'field']);

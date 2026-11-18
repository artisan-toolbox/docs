<?php

use App\Demo\Dapter\Paging\NotebookDriver;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;

function dapterComparisonDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Comparisons/cases.json'), flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (stdClass $case): array => [$case], $cases));
}

function comparisonDemoRequest(object $case): TestResponse
{
    return test()->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR));
}

test('executes each documented source-specific comparison using its public route', function (stdClass $case) {
    if ($case->requiresPostgres ?? false) {
        if (config('docs-dapter-comparisons.enabled') !== true) {
            comparisonDemoRequest($case)->assertInternalServerError()->assertJsonMissingPath('capabilities');

            return;
        }
    }

    $response = comparisonDemoRequest($case)->assertStatus($case->expected->status);
    if ($case->expected->status !== 200) {
        $response->assertJsonPath('error.kind', $case->expected->kind);
        expect($response->json())->not->toHaveKeys(['data', 'capabilities']);

        return;
    }

    expect(array_column($response->json('data'), 'id'))->toBe($case->expected->ids);
    $response->assertJsonPath('paging.total', $case->expected->total)
        ->assertJsonPath('paging.filtered', $case->expected->filtered);
    if (str_starts_with($case->id, 'Locale')) {
        $response->assertJsonPath('capabilities.fields.name.order.locale.locale', 'pt_BR')
            ->assertJsonPath('capabilities.fields.name.order.locale.strength', 'tertiary')
            ->assertJsonPath('capabilities.fields.name.order.locale.normalization', true)
            ->assertJsonPath('capabilities.fields.name.order.locale.numeric', false);
        expect($response->json('capabilities.fields.name.order.locale.validLocale'))->toBeString()->not->toBeEmpty();
        expect($response->json('capabilities.fields.name.order.locale.actualLocale'))->toBeString()->not->toBeEmpty();
        expect($response->json('capabilities.fields.name.order.locale.icuVersion'))->toBeString()->not->toBeEmpty();
    }
    if ($case->requiresPostgres ?? false) {
        $metadata = $case->id === 'PostgresGlobal' ? 'capabilities.global.search.targets.document.fullText' : 'capabilities.fields.title.search.fullText';
        $response->assertJsonPath($metadata.'.engine', 'pgsql')
            ->assertJsonPath($metadata.'.configuration', 'pg_catalog.english')
            ->assertJsonPath($metadata.'.input', 'plain_text')
            ->assertJsonPath($metadata.'.ranking', 'filter_only')
            ->assertJsonPath($metadata.'.maxBytes', 512);
    }
})->with(fn (): array => dapterComparisonDemoCases());

test('preserves each documented Collection comparison and literal Unicode policy', function () {
    $case = dapterComparisonDemoCases()['LiteralComparison'][0];
    $case->request->state->fields = new stdClass;
    foreach (['native' => [4, 3, 2, 1, 6, 5], 'regular' => [4, 3, 2, 1, 6, 5], 'string' => [4, 3, 2, 1, 6, 5], 'natural' => [4, 3, 2, 1, 5, 6], 'numeric' => [4, 3, 2, 5, 1, 6]] as $mode => $ids) {
        $case->request->state->order = ['kind' => 'fields', 'terms' => [['field' => $mode === 'numeric' ? 'score' : 'name', 'direction' => 'asc', 'sortType' => $mode]]];
        expect(array_column(comparisonDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe($ids);
    }
});

test('keeps optional locale admission separate from String order and descending null placement', function () {
    $case = dapterComparisonDemoCases()['LocaleFluent'][0];
    $case->request->state->order->terms[0]->sortType = 'string';
    expect(array_column(comparisonDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe([4, 3, 2, 1, 6, 5]);
    $case->request->state->order->terms[0]->sortType = 'locale';
    $case->request->state->order->terms[0]->direction = 'desc';
    expect(array_column(comparisonDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe([5, 6, 1, 2, 3, 4]);
});

test('does not connect to PostgreSQL while rendering its disabled guide', function () {
    config(['docs-dapter-comparisons.enabled' => false]);
    $queries = [];
    DB::listen(function ($query) use (&$queries): void {
        if ($query->connectionName === 'dapter_comparisons_pgsql') {
            $queries[] = $query->sql;
        }
    });
    $this->get(route('docs.show', ['slug' => 'dapter/postgresql-full-text']))->assertOk();
    expect($queries)->toBe([]);
    comparisonDemoRequest(dapterComparisonDemoCases()['PostgresField'][0])->assertInternalServerError();
    expect($queries)->toBe([]);
});

test('uses equivalent PostgreSQL attribute and captured configuration global targets', function () {
    if (config('docs-dapter-comparisons.enabled') !== true) {
        foreach (['PostgresAttribute', 'PostgresConfig'] as $id) {
            comparisonDemoRequest(dapterComparisonDemoCases()[$id][0])->assertInternalServerError()->assertJsonMissingPath('capabilities');
        }

        return;
    }
    foreach (['PostgresAttribute', 'PostgresConfig'] as $id) {
        $case = dapterComparisonDemoCases()[$id][0];
        $case->request->state->fields = new stdClass;
        $case->request->state->global = ['search' => ['value' => 'running']];
        $response = comparisonDemoRequest($case)->assertOk()->assertJsonPath('paging.filtered', 1);
        expect(array_column($response->json('data'), 'id'))->toBe([1]);
        $response->assertJsonPath('capabilities.global.search.targets.document.fullText.configuration', 'pg_catalog.english');
    }
});

test('accepts the documented filter before a forged operation is added', function () {
    $case = dapterComparisonDemoCases()['RegexRejected'][0];
    unset($case->request->state->fields->name);
    $response = comparisonDemoRequest($case)->assertOk()->assertJsonPath('paging.filtered', 4);
    expect(array_column($response->json('data'), 'id'))->toBe([1, 2, 3, 4]);
});

test('keeps legacy custom capability construction independent of optional comparison policy', function () {
    $driver = new NotebookDriver(new CollectionStoreDriver(collect([])));
    expect($driver->capabilities()->comparisons)->toBeNull();
});

test('enforces the displayed PostgreSQL parser and bounded plain-text input policy', function () {
    $case = dapterComparisonDemoCases()['PostgresField'][0];
    if (config('docs-dapter-comparisons.enabled') !== true) {
        comparisonDemoRequest($case)->assertInternalServerError()->assertJsonMissingPath('capabilities');

        return;
    }
    foreach (['run' => [1], 'the' => [], 'running | library' => [], '' => [1, 2, 3, 4], str_repeat('a', 512) => []] as $value => $ids) {
        $case->request->state->fields->title->search->value = $value;
        expect(array_column(comparisonDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe($ids);
    }
    foreach ([str_repeat('a', 513), "running\0fox"] as $value) {
        $case->request->state->fields->title->search->value = $value;
        comparisonDemoRequest($case)->assertUnprocessable()->assertJsonMissingPath('data');
    }
});

<?php

use App\Demo\Dapter\Literal\AwareDriver;
use App\Demo\Dapter\Literal\Declaration;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverRegistry;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;
use ArtisanToolbox\Dapter\Support\SourceRegistry;
use Illuminate\Support\Facades\DB;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\LiteralPolicyProbe;
use Tests\Fixtures\LiteralUnawareDriver;

function literalDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Literal/cases.json'), flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (stdClass $case): array => [$case], $cases));
}

function literalDemoRequest(object $case): TestResponse
{
    return test()->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR));
}

beforeEach(function () {
    config(['database.connections.dapter_literal_demo' => ['driver' => 'sqlite', 'database' => ':memory:', 'prefix' => '', 'foreign_key_constraints' => true]]);
    DB::purge('dapter_literal_demo');
    $fixture = DB::connection('dapter_literal_demo');
    $fixture->getSchemaBuilder()->create('literal_search_records', function ($table) {
        $table->integer('id')->primary();
        $table->text('name');
        $table->integer('tenant');
    });
    $fixture->table('literal_search_records')->insert(json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Literal/records.json'), true, flags: JSON_THROW_ON_ERROR));
    LiteralPolicyProbe::$reads = 0;
    LiteralUnawareDriver::$executions = 0;
    resolve(SourceRegistry::class)->register('Literal.PolicyProbe', LiteralPolicyProbe::class);
});

test('executes every fixed literal source with all four field operators and its global target', function (stdClass $case) {
    foreach (['contains', 'equals', 'starts_with', 'ends_with'] as $operator) {
        $case->request->state->fields->name->search->matchType = $operator;
        $response = literalDemoRequest($case)->assertOk()->assertJsonPath('paging.total', 7)->assertJsonPath('paging.filtered', $case->expected->filtered)->assertJsonPath('requested.fields.name.search.value', 'joao');
        expect(array_column($response->json('data'), 'id'))->toBe($case->expected->ids);
        expect($response->json('capabilities'))->not->toHaveKeys(['strictLiteralSearch', 'strict_literal_search']);
    }
    $case->request->state->fields = new stdClass;
    $case->request->state->global = ['search' => ['value' => 'joao']];
    expect(array_column(literalDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe($case->expected->ids);
})->with(fn (): array => literalDemoCases());

test('checks each fixed global operator through the public source registry under both policies', function () {
    $case = literalDemoCases()['LiteralDefault'][0];
    $case->source = 'Literal.PolicyProbe';
    $case->request->state->fields = new stdClass;
    $case->request->state->global = ['search' => ['value' => 'joao']];
    foreach ([false, true] as $strict) {
        foreach ([MatchType::Contains, MatchType::Equals, MatchType::StartsWith, MatchType::EndsWith] as $operator) {
            LiteralPolicyProbe::$settings = StoreOptions::make()->publicAccess()->pageSize(7)->pageSizeOptions([7])->strictLiteralSearch($strict)->globalSearchable(['name' => new SearchTarget('name', matchType: $operator)]);
            expect(array_column(literalDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe($strict ? [7] : range(1, 7));
        }
    }
});

test('preserves the original text and exact strict composition', function () {
    $case = literalDemoCases()['LiteralDefault'][0];
    foreach (['joao', 'João', "Joa\u{0303}o", 'JOÃO'] as $needle) {
        $case->request->state->fields->name->search->value = $needle;
        $response = literalDemoRequest($case)->assertOk()->assertJsonPath('requested.fields.name.search.value', $needle);
        expect(array_column($response->json('data'), 'id'))->toBe(range(1, 7));
    }
    $case->source = 'Dapter.LiteralStrictFluent';
    foreach (['joao' => [7], 'João' => [3], "Joa\u{0303}o" => [6], 'JOÃO' => [4]] as $needle => $ids) {
        $case->request->state->fields->name->search->value = $needle;
        expect(array_column(literalDemoRequest($case)->assertOk()->json('data'), 'id'))->toBe($ids);
    }
});

test('captures configured strictness, honors false overrides, and ignores configured factory defaults when requested', function () {
    config(['dapter.declarations.strict_literal_search' => false]);
    literalDemoRequest(literalDemoCases()['LiteralConfigured'][0])->assertOk()->assertJsonPath('paging.filtered', 1);
    expect(config('dapter.declarations.strict_literal_search'))->toBeFalse();
    literalDemoRequest(literalDemoCases()['LiteralFalseOverride'][0])->assertOk()->assertJsonPath('paging.filtered', 7);
    config(['dapter.declarations.strict_literal_search' => true]);
    LiteralPolicyProbe::$settings = StoreOptions::makeWithoutDefaults()->publicAccess()->guard('web')->pagingMode(PagingMode::Offset)->pageSize(7)->pageSizeOptions([7])->searchableField('name');
    $case = literalDemoCases()['LiteralDefault'][0];
    $case->source = 'Literal.PolicyProbe';
    literalDemoRequest($case)->assertOk()->assertJsonPath('paging.filtered', 7);
});

test('delegates strict behavior through an aware driver and rejects unaware row execution', function () {
    $case = literalDemoCases()['LiteralDefault'][0];
    $case->source = 'Literal.PolicyProbe';
    LiteralPolicyProbe::$settings = Declaration::options()->strictLiteralSearch()->driver('docs_literal_driver');
    literalDemoRequest($case)->assertOk()->assertJsonPath('paging.filtered', 1);
    resolve(DriverRegistry::class)->register('docs_literal_unaware', static fn (CollectionSource $source): LiteralUnawareDriver => new LiteralUnawareDriver(new CollectionStoreDriver(collect($source->source()))));
    LiteralPolicyProbe::$settings = Declaration::options()->driver('docs_literal_unaware');
    literalDemoRequest($case)->assertInternalServerError()->assertJsonMissingPath('data');
    expect(LiteralUnawareDriver::$executions)->toBe(0);
    expect((new AwareDriver(new CollectionStoreDriver(collect([]))))->capabilities()->literalSearchPolicy)->toBeTrue();
});

test('rejects browser sensitivity overrides before source acquisition', function () {
    $case = literalDemoCases()['LiteralDefault'][0];
    $case->source = 'Literal.PolicyProbe';
    LiteralPolicyProbe::$settings = Declaration::options();
    foreach (['strictLiteralSearch', 'strict_literal_search'] as $key) {
        $case->request->state->fields->name->search->{$key} = true;
        literalDemoRequest($case)->assertUnprocessable()->assertJsonMissingPath('data');
        unset($case->request->state->fields->name->search->{$key});
    }
    expect(LiteralPolicyProbe::$reads)->toBe(0);
});

test('keeps SQLite filtering, counts, and bounded row reads in SQL', function () {
    $queries = [];
    DB::listen(function ($query) use (&$queries) {
        if ($query->connectionName === 'dapter_literal_demo') {
            $queries[] = $query->sql;
        }
    });
    literalDemoRequest(literalDemoCases()['LiteralSqlite'][0])->assertOk()->assertJsonPath('paging.total', 7)->assertJsonPath('paging.filtered', 7);
    expect(collect($queries)->contains(fn (string $sql): bool => str_contains(strtolower($sql), 'count(')))->toBeTrue();
    expect(collect($queries)->contains(fn (string $sql): bool => str_contains(strtolower($sql), 'limit 7')))->toBeTrue();
    expect(collect($queries)->filter(fn (string $sql): bool => str_starts_with(strtolower($sql), 'select *'))->every(fn (string $sql): bool => str_contains(strtolower($sql), 'where') && str_contains(strtolower($sql), 'limit')))->toBeTrue();
});

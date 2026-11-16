<?php

use App\DataSources\SharedFixtures\Context;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;
use Composer\InstalledVersions;
use Illuminate\Auth\Access\Response;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Process\Process;

require_once __DIR__.'/../Fixtures/DapterSharedSources.php';

function sharedDapterFixtures(): array
{
    return json_decode(file_get_contents(__DIR__.'/../../resources/js/pages/docs/dapter/design/reference/fixtures.json'), true, flags: JSON_THROW_ON_ERROR);
}

function sharedDapterCases(string $group): array
{
    $cases = [];
    foreach (sharedDapterFixtures()['groups'][$group] as $case) {
        if ($case['evidence'] === 'current-runtime') {
            $cases[$case['id']] = [$case];
        }
    }

    return $cases;
}

beforeEach(function () {
    Context::$options = null;
    Context::$rows = sharedDapterFixtures()['rows'];
    Context::$tenant = 'north';
    Context::$driver = 'sqlite';
    Context::$limit = null;
    Context::$failure = null;
    Context::$hooks = 0;
    Context::$reads = 0;
    config()->set('dapter.paging', ['mode' => PagingMode::Offset, 'per_page' => 2, 'per_page_options' => [2, 3]]);
    config()->set('dapter.access.guard', 'web');
});

test('executes current declaration fixtures through installed public factories and the route', function (array $case) {
    $input = $case['input'];
    $expected = $case['expected'];
    if ($case['operation'] === 'isolation') {
        $base = StoreOptions::make();
        $left = $base->pageSize($input['leftSize']);
        $right = $base->pageSize($input['rightSize']);
        foreach (['left' => $left, 'right' => $right, 'baseline' => $base] as $key => $options) {
            Context::$options = $options;
            $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.Options']), ['version' => 1])
                ->assertOk()->assertJsonPath('capabilities.paging.per_page', $expected[$key]);
        }

        return;
    }
    if ($case['operation'] === 'config-cache') {
        $cache = tempnam(sys_get_temp_dir(), 'dapter-config-');
        File::delete($cache);
        try {
            $process = new Process([PHP_BINARY, 'artisan', 'config:cache', '--no-interaction'], base_path(), ['APP_CONFIG_CACHE' => $cache]);
            $process->mustRun();
            $cached = require $cache;
            expect($cached['dapter']['paging']['mode'])->toBe(PagingMode::Offset);
            config()->set('dapter', $cached['dapter']);
            expect($cached['dapter']['paging']['per_page'])->toBe($input['per_page'])
                ->and($cached['dapter']['paging']['per_page_options'])->toBe($input['per_page_options'])
                ->and($cached['dapter']['access']['guard'])->toBe($input['guard']);
            $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.SourceOnly']), ['version' => 1])
                ->assertOk()->assertJsonPath('paging.mode', $expected['mode'])
                ->assertJsonPath('capabilities.paging.per_page', $expected['per_page'])
                ->assertJsonPath('capabilities.paging.per_page_options', $expected['per_page_options']);
        } finally {
            if (is_file($cache)) {
                File::delete($cache);
            }
        }

        return;
    }
    if (isset($input['factory'])) {
        $options = $input['factory'] === 'make' ? StoreOptions::make() : StoreOptions::makeWithoutDefaults();
        foreach ($input['setters'] as [$method, $value]) {
            $options = $options->{$method}($method === 'pagingMode' ? PagingMode::from($value) : $value);
        }
        Context::$options = $options;
    }
    $response = $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.'.$input['source']]), ['version' => 1])
        ->assertStatus($expected['status']);
    expect(Context::$hooks)->toBe($expected['hooks']);
    if ($expected['status'] === 200) {
        $response->assertJsonCount($expected['rows'], 'data')
            ->assertJsonPath('capabilities.paging.per_page', $expected['size'])
            ->assertJsonPath('capabilities.paging.per_page_options', $expected['sizes']);
        expect(Context::$reads)->toBe(1);
    } else {
        $response->assertJsonPath('error.code', $expected['error'])->assertJsonMissingPath('data')->assertJsonMissingPath('paging');
        expect(Context::$reads)->toBe($expected['reads']);
    }
})->with(fn (): array => sharedDapterCases('declarations'));

test('executes scoped driver fixtures with public projection, exact counts and canonical clamping', function (array $case) {
    $input = $case['input'];
    $expected = $case['expected'];
    if ($case['operation'] === 'access') {
        Context::$options = StoreOptions::make()->publicAccess()->authorize($input['ability']);
        Gate::define($input['ability'], static fn (?Authenticatable $user): Response => Response::denyAsNotFound());
        $response = $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.'.$input['source']]), ['version' => 1])
            ->assertStatus($expected['status']);
        expect($response->json())->toBe(['version' => 1, 'error' => $expected['error']])
            ->and(Context::$reads)->toBe($expected['sourceReads']);
        $missing = $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.Missing']), ['version' => 1]);
        expect($response->json())->toBe($missing->json());

        return;
    }
    Context::$driver = $input['driver'];
    Context::$tenant = $input['tenant'];
    Context::$limit = $input['limit'] ?? null;
    Context::$options = StoreOptions::make()->pageSize($input['per_page'])->pageSizeOptions([$input['per_page']]);
    $source = match ($input['driver']) {
        'array' => 'ArrayRows',
        'collection' => 'CollectionRows',
        default => 'EloquentRows',
    };
    if ($input['driver'] === 'sqlite') {
        Schema::create('dapter_shared_rows', function (Blueprint $table) {
            $table->unsignedInteger('id')->primary();
            $table->string('name');
            $table->string('tenant');
            $table->string('status');
            $table->integer('price');
            $table->string('private_note');
        });
        DB::table('dapter_shared_rows')->insert(Context::$rows);
    } elseif (in_array($input['driver'], ['mysql', 'pgsql'], true)) {
        config()->set('database.connections.dapter-shared-'.$input['driver'], ['driver' => $input['driver'], 'database' => 'unconnected_fixture', 'host' => '127.0.0.1', 'port' => 1, 'username' => 'fixture', 'password' => '', 'charset' => 'utf8', 'prefix' => '']);
    }
    $queries = [];
    DB::listen(function ($query) use (&$queries) {
        $queries[] = $query->sql;
    });
    $response = $this->postJson(route('dapter.data', ['source' => 'SharedFixtures.'.$source]), [
        'version' => 1,
        'state' => ['version' => 1, 'fields' => (object) [], 'global' => (object) [], 'searchMatch' => 'all', 'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'current' => $input['current'], 'per_page' => $input['per_page']]],
    ])->assertStatus($expected['status']);
    if ($expected['status'] === 200) {
        $response->assertJsonPath('data', $expected['rows'])->assertJsonPath('paging.total', $expected['total'])
            ->assertJsonPath('paging.filtered', $expected['filtered'])->assertJsonPath('paging.current', $expected['current'])
            ->assertJsonPath('paging.pages', $expected['pages'])->assertJsonMissingPath('metadata');
        $response->assertDontSee('private_note')->assertDontSee('Never public')->assertDontSee('south');
        if ($input['driver'] !== 'sqlite') {
            expect($queries)->toBe([]);
        }
    } else {
        $response->assertJsonPath('error.code', $expected['error'])->assertJsonMissingPath('data')->assertJsonMissingPath('paging');
        expect($queries)->toHaveCount($expected['sqlStatements']);
    }
})->with(fn (): array => sharedDapterCases('runtime'));

function sharedPublicReadRequests(): array
{
    $path = InstalledVersions::getInstallPath('artisan-toolbox/dapter').'/resources/contracts/read-v1.json';
    $cases = [];
    foreach (json_decode(file_get_contents($path), flags: JSON_THROW_ON_ERROR)->requests as $case) {
        $cases[$case->id] = [$case];
    }

    return $cases;
}

test('reuses every original raw v1 request without copying or normalizing its bytes', function (stdClass $case) {
    $path = InstalledVersions::getInstallPath('artisan-toolbox/dapter').'/resources/contracts/read-v1.json';
    $fixture = json_decode(file_get_contents($path), flags: JSON_THROW_ON_ERROR)->fixture;
    Context::$options = StoreOptions::make()->publicAccess($case->context !== 'required')
        ->pageSize($fixture->per_page)->pageSizeOptions($fixture->per_page_options);
    Context::$rows = $case->context === 'empty' ? [] : $fixture->rows;
    Context::$failure = in_array($case->context, ['server', 'custom422'], true) ? $case->context : null;
    $source = $case->context === 'missing' ? 'Missing' : 'ProtocolRows';
    $response = $this->call('POST', route('dapter.data', ['source' => 'SharedFixtures.'.$source]),
        server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: $case->request_json)
        ->assertStatus($case->status);
    expect(json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR))->toEqual($case->response)
        ->and(Context::$reads)->toBe($case->reads);
})->with(fn (): array => sharedPublicReadRequests());

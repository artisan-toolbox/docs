<?php

use App\DataSources\Dapter\PagingRecovery;
use Illuminate\Support\Facades\Date;

function pagingDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Paging/cases.json'), true, flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (array $case): array => [$case], $cases));
}
function pagingDemoRequest(array $response, array $position): array
{
    return ['version' => 2, 'state' => [...$response['requested'], 'fields' => (object) $response['requested']['fields'], 'global' => (object) $response['requested']['global'], 'paging' => [...$response['requested']['paging'], ...$position]]];
}
test('executes each focused paging example through the public package route', function (array $case) {
    $before = config('dapter.paging.exact_counts');
    $response = $this->postJson(route('dapter.data', ['source' => $case['source']]), $case['request'])->assertOk();
    $response->assertJsonPath('paging.mode', $case['expected']['mode'])->assertJsonPath('capabilities.paging.counts', $case['expected']['counts']);
    expect(array_column($response->json('data'), 'id'))->toBe([1, 2]);
    expect($response->json('paging.pages'))->toBeNull()->and($response->json('paging.total'))->toBe($case['expected']['counts'] === 'exact' ? 7 : null);
    expect(config('dapter.paging.exact_counts'))->toBe($before);
    if ($case['expected']['mode'] === 'cursor') {
        $response->assertJsonPath('paging.current', null)->assertJsonPath('capabilities.paging.expires_after', 900);
        expect($response->json('paging.next_cursor'))->toBeString();
    }
})->with(fn (): array => pagingDemoCases());
test('traverses simple and cursor sources and returns to the same first rows', function (string $source, string $mode) {
    $first = $this->postJson(route('dapter.data', ['source' => $source]), ['version' => 2])->assertOk()->json();
    $nextPosition = $mode === 'simple' ? ['current' => 2] : ['cursor' => $first['paging']['next_cursor']];
    $next = $this->postJson(route('dapter.data', ['source' => $source]), pagingDemoRequest($first, $nextPosition))->assertOk()->json();
    expect(array_column($next['data'], 'id'))->toBe([3, 4]);
    $previousPosition = $mode === 'simple' ? ['current' => 1] : ['cursor' => $next['paging']['previous_cursor']];
    $previous = $this->postJson(route('dapter.data', ['source' => $source]), pagingDemoRequest($next, $previousPosition))->assertOk()->json();
    expect(array_column($previous['data'], 'id'))->toBe([1, 2]);
})->with([['Dapter.PagingSimple', 'simple'], ['Dapter.PagingCursor', 'cursor'], ['Dapter.PagingNative', 'cursor'], ['Dapter.PagingDriver', 'simple']]);
test('expires a real cursor with the request scoped demonstration clock and explicitly restarts', function () {
    $route = route('dapter.data', ['source' => 'Dapter.PagingRecovery']);
    $clock = Date::getTestNow();
    $first = $this->postJson($route, ['version' => 2])->assertOk()->json();
    $this->postJson(route('demo.dapter.paging.expire'))->assertOk();
    $this->postJson($route, pagingDemoRequest($first, ['cursor' => $first['paging']['next_cursor']]))
        ->assertStatus(409)->assertJsonPath('error.kind', 'cursor_expired')->assertJsonPath('error.recovery', 'restart');
    expect(Date::getTestNow())->toBe($clock);
    $this->postJson($route, pagingDemoRequest($first, ['cursor' => null]))->assertOk()->assertJsonPath('data.0.id', 1);
    expect(Date::getTestNow())->toBe($clock);
});
test('rejects a changed fictional scope and restarts in the new tenant', function () {
    $route = route('dapter.data', ['source' => 'Dapter.PagingRecovery']);
    $first = $this->postJson($route, ['version' => 2])->assertOk()->json();
    $this->postJson(route('demo.dapter.paging.scope'))->assertOk();
    $acquired = PagingRecovery::$acquired;
    $this->postJson($route, pagingDemoRequest($first, ['cursor' => $first['paging']['next_cursor']]))
        ->assertStatus(422)->assertJsonPath('error.code', 'invalid_cursor')->assertJsonPath('errors._dapter_kind.0', 'validation');
    expect(PagingRecovery::$acquired)->toBe($acquired);
    $restart = $this->postJson($route, pagingDemoRequest($first, ['cursor' => null]))->assertOk();
    expect(array_column($restart->json('data'), 'tenant'))->toBe([2, 2]);
    expect(array_column($restart->json('data'), 'id'))->toBe([101, 102]);
    $this->postJson(route('demo.dapter.paging.reset'))->assertOk();
    $this->postJson($route, ['version' => 2])->assertOk()->assertJsonPath('data.0.tenant', 1);
});
test('keeps backend generated advanced wire fixtures synchronized without treating ciphertext as deterministic', function () {
    $fixtures = [];
    $rawFixtures = [];
    foreach (['PagingSimple', 'PagingCursor', 'PagingCounts', 'PagingSimpleAttributes', 'PagingCursorAttributes', 'PagingNative', 'PagingRecovery', 'PagingDriver', 'PagingCountsAttributes', 'PagingCountsConfig', 'PagingCountsOff'] as $name) {
        $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.'.$name]), ['version' => 2])->assertOk();
        $fixtures[$name] = $response->json();
        $rawFixtures[$name] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    $cursorRoute = route('dapter.data', ['source' => 'Dapter.PagingCursor']);
    $first = $fixtures['PagingCursor'];
    $requests = [
        'PagingCursorNext' => pagingDemoRequest($first, ['cursor' => $first['paging']['next_cursor']]),
        'PagingCursorSearch' => ['version' => 2, 'state' => [...pagingDemoRequest($first, ['cursor' => null])['state'], 'fields' => ['name' => ['search' => ['value' => 'Notebook 03', 'matchType' => 'contains']]]]],
    ];
    foreach ($requests as $name => $request) {
        $response = $this->postJson($cursorRoute, $request)->assertOk();
        $fixtures[$name] = $response->json();
        $rawFixtures[$name] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    foreach ([
        'PagingCursorPrevious' => pagingDemoRequest($fixtures['PagingCursorNext'], ['cursor' => $fixtures['PagingCursorNext']['paging']['previous_cursor']]),
        'PagingCursorSearchSize' => pagingDemoRequest($fixtures['PagingCursorSearch'], ['per_page' => 3]),
    ] as $name => $request) {
        $response = $this->postJson($cursorRoute, $request)->assertOk();
        $fixtures[$name] = $response->json();
        $rawFixtures[$name] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    $recoveryRoute = route('dapter.data', ['source' => 'Dapter.PagingRecovery']);
    $this->postJson(route('demo.dapter.paging.expire'))->assertOk();
    $response = $this->postJson($recoveryRoute, pagingDemoRequest($fixtures['PagingRecovery'], ['cursor' => $fixtures['PagingRecovery']['paging']['next_cursor']]))->assertStatus(409);
    $fixtures['PagingRecoveryExpired'] = $response->json();
    $rawFixtures['PagingRecoveryExpired'] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $response = $this->postJson($recoveryRoute, pagingDemoRequest($fixtures['PagingRecovery'], ['cursor' => null]))->assertOk();
    $fixtures['PagingRecoveryExpiredRestart'] = $response->json();
    $rawFixtures['PagingRecoveryExpiredRestart'] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $this->postJson(route('demo.dapter.paging.reset'))->assertOk();
    $this->postJson(route('demo.dapter.paging.scope'))->assertOk();
    $response = $this->postJson($recoveryRoute, pagingDemoRequest($fixtures['PagingRecovery'], ['cursor' => $fixtures['PagingRecovery']['paging']['next_cursor']]))->assertStatus(422);
    $fixtures['PagingRecoveryInvalid'] = $response->json();
    $rawFixtures['PagingRecoveryInvalid'] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $response = $this->postJson($recoveryRoute, pagingDemoRequest($fixtures['PagingRecovery'], ['cursor' => null]))->assertOk();
    $fixtures['PagingRecoveryRestart'] = $response->json();
    $rawFixtures['PagingRecoveryRestart'] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $this->postJson(route('demo.dapter.paging.reset'))->assertOk();
    $file = base_path('resources/js/components/demo/dapter/paging/wire.json');
    if (getenv('UPDATE_DAPTER_PAGING_FIXTURES') === '1') {
        file_put_contents($file, json_encode($rawFixtures, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
    }
    $expected = json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
    foreach ($fixtures as $name => $wire) {
        foreach (['requested', 'state'] as $position) {
            if (is_string($wire[$position]['paging']['cursor'] ?? null)) {
                expect($expected[$name][$position]['paging']['cursor'])->toBeString();
                $wire[$position]['paging']['cursor'] = $expected[$name][$position]['paging']['cursor'];
            }
        }
        foreach (['cursor', 'previous_cursor', 'next_cursor'] as $position) {
            if (is_string($wire['paging'][$position] ?? null)) {
                expect($expected[$name]['paging'][$position])->toBeString();
                $wire['paging'][$position] = $expected[$name]['paging'][$position];
            }
        }
        expect($wire)->toEqual($expected[$name]);
    }
});

test('keeps all native windows inside the fictional tenant predicate', function () {
    $route = route('dapter.data', ['source' => 'Dapter.PagingNative']);
    $window = $this->postJson($route, ['version' => 2])->assertOk()->json();
    $ids = array_column($window['data'], 'id');
    while ($window['paging']['has_next']) {
        $window = $this->postJson($route, pagingDemoRequest($window, ['cursor' => $window['paging']['next_cursor']]))->assertOk()->json();
        $ids = [...$ids, ...array_column($window['data'], 'id')];
        expect(array_unique(array_column($window['data'], 'tenant')))->toBe([1]);
    }
    expect($ids)->toBe(range(1, 7));
});

test('uses captured count defaults and explicit false attribute and fluent overrides', function () {
    config(['dapter.paging.exact_counts' => true]);
    foreach (['PagingSimple' => 'exact', 'PagingSimpleAttributes' => 'unknown', 'PagingCountsOff' => 'unknown'] as $source => $policy) {
        $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.'.$source]), ['version' => 2])->assertOk();
        $response->assertJsonPath('capabilities.paging.counts', $policy)->assertJsonPath('paging.total', $policy === 'exact' ? 7 : null);
        expect(config('dapter.paging.exact_counts'))->toBeTrue();
    }
});

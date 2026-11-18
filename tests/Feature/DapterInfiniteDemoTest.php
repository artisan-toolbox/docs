<?php

function infiniteDemoRequest(array $response, array $position): array
{
    return ['version' => 2, 'state' => [...$response['requested'], 'fields' => (object) $response['requested']['fields'], 'global' => (object) $response['requested']['global'], 'paging' => [...$response['requested']['paging'], ...$position]]];
}

test('reads the focused infinite fixtures through the existing public route', function () {
    $cases = json_decode(file_get_contents(base_path('app/Demo/Dapter/Infinite/cases.json')), true, flags: JSON_THROW_ON_ERROR);
    foreach ($cases as $case) {
        $response = $this->postJson(route('dapter.data', ['source' => $case['source']]), $case['request'])->assertStatus($case['expected']['status']);
        $response->assertJsonPath('paging.mode', $case['expected']['mode']);
        if (isset($case['expected']['ids'])) {
            expect(array_column($response->json('data'), 'id'))->toBe($case['expected']['ids']);
        } else {
            expect(array_map(fn (array $row): array => [$row['record_id'], $row['line_id']], $response->json('data')))->toBe($case['expected']['tuples']);
        }
    }
});

test('preserves every joined result tuple across one-row append boundaries', function () {
    $route = route('dapter.data', ['source' => 'Dapter.InfiniteJoined']);
    $page = $this->postJson($route, ['version' => 2])->assertOk()->json();
    $tuples = [];
    do {
        foreach ($page['data'] as $row) {
            $tuples[] = [$row['record_id'], $row['line_id']];
        }
        if (! $page['paging']['has_next']) {
            break;
        }
        $page = $this->postJson($route, infiniteDemoRequest($page, ['current' => $page['paging']['current'] + 1]))->assertOk()->json();
    } while (true);
    expect($tuples)->toBe([[1, 11], [1, 12], [2, 21]]);
});

test('isolates a recoverable failure in the fictional session without changing authorization', function () {
    $route = route('dapter.data', ['source' => 'Dapter.InfiniteRecovery']);
    $first = $this->postJson($route, ['version' => 2])->assertOk()->json();
    $request = infiniteDemoRequest($first, ['current' => 2]);
    $this->postJson(route('demo.dapter.infinite.fail'))->assertOk();
    $this->postJson($route, $request)->assertStatus(500);
    $this->postJson(route('dapter.data', ['source' => 'Dapter.InfiniteSimple']), ['version' => 2])->assertOk();
    $this->postJson(route('demo.dapter.infinite.reset'))->assertOk();
    $response = $this->postJson($route, $request)->assertOk();
    expect(array_column($response->json('data'), 'id'))->toBe([3, 4]);
    expect(auth()->check())->toBeFalse();
});

test('captures complete real infinite envelopes and executes generated cursor tokens', function () {
    $fixtures = [];
    foreach (['InfiniteSimple', 'InfiniteCursor', 'InfiniteJoined', 'InfiniteRecovery'] as $name) {
        $route = route('dapter.data', ['source' => 'Dapter.'.$name]);
        $response = $this->postJson($route, ['version' => 2])->assertOk();
        $page = $response->json();
        $fixtures[$name] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
        for ($ordinal = 2; $page['paging']['has_next']; $ordinal++) {
            $position = $name === 'InfiniteCursor' ? ['cursor' => $page['paging']['next_cursor']] : ['current' => $ordinal];
            $response = $this->postJson($route, infiniteDemoRequest($page, $position))->assertOk();
            $page = $response->json();
            $fixtures[$name.$ordinal] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
        }
    }
    $route = route('dapter.data', ['source' => 'Dapter.InfiniteSimple']);
    foreach ([
        'InfiniteSimpleSearch' => ['fields' => ['name' => ['search' => ['value' => 'Notebook 03', 'matchType' => 'contains']]]],
        'InfiniteSimpleOrder' => ['order' => ['kind' => 'fields', 'terms' => [['field' => 'name', 'direction' => 'desc', 'sortType' => 'native']]]],
        'InfiniteSimpleSize' => ['paging' => ['mode' => 'simple', 'current' => 1, 'per_page' => 3]],
    ] as $name => $state) {
        $response = $this->postJson($route, ['version' => 2, 'state' => [...infiniteDemoRequest(json_decode(json_encode($fixtures['InfiniteSimple'], JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR), [])['state'], ...$state]])->assertOk();
        $fixtures[$name] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    $this->postJson(route('demo.dapter.infinite.fail'))->assertOk();
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.InfiniteRecovery']), ['version' => 2])->assertStatus(500);
    $fixtures['InfiniteRecoveryFailure'] = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $this->postJson(route('demo.dapter.infinite.reset'))->assertOk();
    $file = base_path('resources/js/components/demo/dapter/infinite/wire.json');
    if (getenv('UPDATE_DAPTER_INFINITE_FIXTURES') === '1') {
        file_put_contents($file, json_encode($fixtures, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
    }
    $expected = json_decode(file_get_contents($file), flags: JSON_THROW_ON_ERROR);
    foreach ($fixtures as $name => $wire) {
        foreach (['requested', 'state'] as $position) {
            if (is_string($wire->{$position}->paging->cursor ?? null)) {
                expect($expected->{$name}->{$position}->paging->cursor)->toBeString();
                $wire->{$position}->paging->cursor = $expected->{$name}->{$position}->paging->cursor;
            }
        }
        foreach (['cursor', 'previous_cursor', 'next_cursor'] as $position) {
            if (is_string($wire->paging->{$position} ?? null)) {
                expect($expected->{$name}->paging->{$position})->toBeString();
                $wire->paging->{$position} = $expected->{$name}->paging->{$position};
            }
        }
        expect($wire)->toEqual($expected->{$name});
    }
});

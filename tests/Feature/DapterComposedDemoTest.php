<?php

use App\Demo\Dapter\Composed\Records;

function composedDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Composed/cases.json'), flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (stdClass $case): array => [$case], $cases));
}

test('executes each composed demo through the public route', function (stdClass $case) {
    Records::$constructed = Records::$applied = 0;
    $response = $this->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR))->assertStatus($case->expected->status);
    if ($case->expected->status !== 200) {
        $response->assertJsonPath('error.kind', $case->id === 'MultiLimit' ? 'unsupported_operation' : ($case->expected->status === 422 ? 'validation' : 'server'));
        expect(Records::$constructed)->toBe(0)->and(Records::$applied)->toBe(0);

        return;
    }
    $rows = $response->json('data');
    $key = isset($rows[0]['record_id']) ? 'record_id' : 'id';
    expect(array_column($rows, $key))->toBe($case->expected->ids);
    $response->assertJsonPath('version', 2)->assertJsonPath('paging.filtered', $case->expected->filtered);
    expect($response->getContent())->not->toContain('"target"');
    if (in_array($case->id, ['GlobalStatus', 'GlobalMany'], true)) {
        expect(Records::$constructed)->toBe(1)->and(Records::$applied)->toBe(1);
    }
})->with(fn (): array => composedDemoCases());

test('preserves configured defaults after snapshot demos and rejects invalid finite values before handlers', function () {
    $before = config('dapter.declarations');
    $this->postJson(route('dapter.data', ['source' => 'Dapter.ComposedConfig']), ['version' => 2])->assertOk();
    expect(config('dapter.declarations'))->toBe($before);
    foreach ([null, false, 0, '0', ''] as $value) {
        $this->postJson(route('dapter.data', ['source' => 'Dapter.ComposedCatalog']), ['version' => 2, 'state' => ['version' => 2, 'fields' => new stdClass, 'global' => ['filters' => ['mixed' => ['value' => $value]]], 'searchMatch' => 'all', 'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'current' => 1, 'per_page' => 4]]])->assertOk();
    }
});

test('keeps the real composed metadata fixture synchronized for public Vue controls', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.ComposedCatalog']), ['version' => 2])->assertOk();
    $file = base_path('resources/js/components/demo/dapter/composed/wire.json');
    if (getenv('UPDATE_DAPTER_WIRE_FIXTURES') === '1') {
        file_put_contents($file, json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
    } else {
        expect(json_decode($response->getContent()))->toEqual(json_decode(file_get_contents($file)));
    }
});

test('executes private inherited invokable and PHP 8.5 static Closure declarations with equivalent results', function () {
    foreach (['reverse' => [4, 3, 2, 1], 'external' => [4, 3, 2, 1], 'closure' => [1, 2, 3, 4]] as $preset => $ids) {
        $request = ['version' => 2, 'state' => ['version' => 2, 'fields' => new stdClass, 'global' => new stdClass, 'searchMatch' => 'all', 'order' => ['kind' => 'preset', 'id' => $preset], 'paging' => ['mode' => 'offset', 'current' => 1, 'per_page' => 4]]];
        $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.ComposedAttributes']), $request)->assertOk();
        expect(array_column($response->json('data'), 'id'))->toBe($ids);
    }
});

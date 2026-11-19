<?php

function vueCatalogRead(?array $state = null): array
{
    $request = ['version' => 2];
    if ($state !== null) {
        $request['state'] = $state;
    }

    return $request;
}

function vueCatalogState(array $fields = [], int $current = 1, int $size = 2): array
{
    return ['version' => 2, 'fields' => $fields === [] ? new stdClass : $fields, 'global' => new stdClass, 'searchMatch' => 'all', 'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'current' => $current, 'per_page' => $size]];
}

test('serves the exact public initial response consumed by the Vue demos', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), vueCatalogRead())->assertOk();
    $fixture = json_decode(file_get_contents(resource_path('js/components/demo/dapter/vue/response.json')), true, flags: JSON_THROW_ON_ERROR);
    expect($response->json())->toBe($fixture);
});

test('combines the Vue demo search and scalar selections without dropping false zero or selected null', function () {
    $fields = [
        'name' => ['search' => ['value' => 'Pencil', 'matchType' => 'contains']],
        'active' => ['filters' => ['active' => ['value' => false]]],
        'score' => ['filters' => ['score' => ['value' => 0]]],
        'optional' => ['filters' => ['optional' => ['value' => null]]],
    ];
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), vueCatalogRead(vueCatalogState($fields, 9)))
        ->assertOk()->assertJsonPath('paging.total', 4)->assertJsonPath('paging.filtered', 1)
        ->assertJsonPath('requested.paging.current', 1)->assertJsonPath('requested.fields.optional.filters.optional.value', null);
    expect(array_column($response->json('data'), 'id'))->toBe([4]);
    expect($response->json('requested.fields'))->toBe($fields);
});

test('replaces selections completely and then requests server defaults for the Vue demo', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), vueCatalogRead(vueCatalogState(['category' => ['filters' => ['category' => ['value' => 'paper']]]], size: 4)))
        ->assertOk()->assertJsonPath('paging.filtered', 2)->assertJsonPath('paging.per_page', 4);
    expect(array_column($response->json('data'), 'id'))->toBe([1, 2]);
    $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), vueCatalogRead())->assertOk()
        ->assertJsonPath('paging.per_page', 2)->assertJsonPath('paging.filtered', 4)->assertJsonPath('requested.fields', []);
});

test('rejects an invalid Vue snapshot before returning protected rows', function () {
    $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), vueCatalogRead(vueCatalogState(['score' => ['filters' => ['score' => ['value' => '0']]]])))
        ->assertStatus(422)->assertJsonPath('error.kind', 'validation')->assertJsonMissingPath('data');
});

test('negotiates the saved catalog lifetime and custom key without changing legacy envelopes', function () {
    $route = route('dapter.data', ['source' => 'Dapter.VueCatalog']);
    $default = $this->postJson($route, vueCatalogRead())->assertOk()->assertJsonMissingPath('browserState');
    $negotiated = $this->withHeader('X-Dapter-Browser-State', '1')->postJson($route, vueCatalogRead())->assertOk()
        ->assertJsonPath('browserState.key', 'saved_catalog')->assertJsonPath('browserState.expiration.minutes', 240);
    expect($negotiated->json('browserState.version'))->toMatch('/^[a-f0-9]{64}$/');
    expect(array_diff_key($negotiated->json(), ['browserState' => true]))->toBe($default->json());
    $again = $this->postJson($route, vueCatalogRead())->assertOk();
    expect($again->json('browserState.version'))->toBe($negotiated->json('browserState.version'));
});

test('inherits configured minutes while the saved catalog keeps its explicit lifetime', function () {
    config()->set('dapter.state.ttl', 17);
    $this->withHeader('X-Dapter-Browser-State', '1')->postJson(route('dapter.data', ['source' => 'Dapter.CollectionDefaults']), ['version' => 2])
        ->assertOk()->assertJsonPath('browserState.expiration.minutes', 17);
    $this->postJson(route('dapter.data', ['source' => 'Dapter.VueCatalog']), ['version' => 2])
        ->assertOk()->assertJsonPath('browserState.expiration.minutes', 240)->assertJsonPath('browserState.key', 'saved_catalog');
});

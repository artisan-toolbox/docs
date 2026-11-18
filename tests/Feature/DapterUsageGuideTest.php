<?php

test('serves ordinary offset pages of notebooks to the overview and Load more demos', function (int $protocol) {
    $url = route('dapter.data', ['source' => 'Dapter.Quickstart']);
    $first = $this->postJson($url, ['version' => $protocol])->assertOk()->assertJsonPath('paging.total', 23);
    expect(array_column($first->json('data'), 'name'))->toBe(array_map(fn (int $id): string => sprintf('Notebook %02d', $id), range(1, 10)));

    $requested = json_decode($first->getContent(), flags: JSON_THROW_ON_ERROR)->requested;
    $requested->paging->current = 2;
    $next = $this->postJson($url, ['version' => $protocol, 'state' => $requested])->assertOk()->assertJsonPath('paging.current', 2);
    expect(array_column($next->json('data'), 'name'))->toBe(array_map(fn (int $id): string => sprintf('Notebook %02d', $id), range(11, 20)));
    $requested->paging->current = 3;
    $last = $this->postJson($url, ['version' => $protocol, 'state' => $requested])->assertOk()->assertJsonPath('paging.has_next', false);
    expect(array_column($last->json('data'), 'name'))->toBe(['Notebook 21', 'Notebook 22', 'Notebook 23']);
})->with([1, 2]);

test('returns the visible rows for an individual field guide and restores source order when cleared', function (array $fields, ?array $terms, array $expected) {
    $url = route('dapter.data', ['source' => 'Dapter.VueCatalog']);
    $first = $this->postJson($url, ['version' => 2])->assertOk();
    $state = json_decode($first->getContent(), flags: JSON_THROW_ON_ERROR)->requested;
    $state->fields = (object) $fields;
    if ($terms !== null) {
        $state->order = ['kind' => 'fields', 'terms' => $terms];
    }
    $result = $this->postJson($url, ['version' => 2, 'state' => $state])->assertOk();
    expect(array_column($result->json('data'), 'name', 'id'))->toBe($expected);

    $state->fields = new stdClass;
    $state->order = ['kind' => 'default'];
    $cleared = $this->postJson($url, ['version' => 2, 'state' => $state])->assertOk();
    expect(array_column($cleared->json('data'), 'name', 'id'))->toBe([1 => 'Notebook 10', 2 => 'Notebook 2']);
})->with([
    'search for Pencil' => [['name' => ['search' => ['value' => 'Pencil', 'matchType' => 'contains']]], null, [3 => 'Pencil 100%_!', 4 => 'Pencil case']],
    'search with no matches' => [['name' => ['search' => ['value' => 'Eraser', 'matchType' => 'contains']]], null, []],
    'filter tools' => [['category' => ['filters' => ['category' => ['value' => 'tools']]]], null, [3 => 'Pencil 100%_!', 4 => 'Pencil case']],
    'natural ascending order' => [[], [['field' => 'name', 'direction' => 'asc', 'sortType' => 'natural']], [2 => 'Notebook 2', 1 => 'Notebook 10']],
]);

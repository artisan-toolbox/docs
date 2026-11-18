<?php

function dapterFieldDemoCases(): array
{
    $cases = json_decode(file_get_contents(dirname(__DIR__, 2).'/app/Demo/Dapter/Fields/cases.json'), flags: JSON_THROW_ON_ERROR);

    return array_combine(array_column($cases, 'id'), array_map(fn (stdClass $case): array => [$case], $cases));
}

test('executes each documented backend field request through the public route', function (stdClass $case) {
    $response = $this->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR))
        ->assertStatus($case->expected->status);

    if ($case->expected->status !== 200) {
        $response->assertJsonPath('error.kind', $case->expected->kind ?? 'validation');
        expect($response->json())->not->toHaveKeys(['data', 'requested', 'capabilities']);

        return;
    }

    expect(array_column($response->json('data'), 'id'))->toBe($case->expected->ids);
    $response->assertJsonPath('version', 2)
        ->assertJsonPath('paging.total', 4)
        ->assertJsonPath('metadata.records.mode', 'unidentified')
        ->assertJsonPath('metadata.channel', null);
    expect($response->getContent())->not->toContain('"target"');
    if (isset($case->expected->driver)) {
        expect(array_column($response->json('data'), 'driver'))->toBe(array_fill(0, count($case->expected->ids), $case->expected->driver));
    }

    if (in_array($case->id, ['FieldsRemoved', 'FieldsRemovedAttributes', 'FieldsDriver', 'FieldsAlias'], true)) {
        expect(json_decode($response->getContent())->capabilities->fields)->toEqual(new stdClass);
    }
    $response->assertJsonPath('paging.filtered', $case->expected->filtered);
})->with(fn (): array => dapterFieldDemoCases());

test('bounds the documented zero-match search against filtered records', function () {
    $case = dapterFieldDemoCases()['SearchContains'][0];
    $case->request->state->fields->name->search->value = 'No such record';
    $case->request->state->paging->current = 999;

    $this->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->request, JSON_THROW_ON_ERROR))
        ->assertOk()
        ->assertJsonPath('data', [])
        ->assertJsonPath('paging.total', 4)
        ->assertJsonPath('paging.filtered', 0)
        ->assertJsonPath('paging.pages', 1)
        ->assertJsonPath('requested.paging.current', 1);
});

test('keeps v1 successful responses unchanged on a field-declared source', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.FieldsFluent']), ['version' => 1])->assertOk();
    expect(array_keys($response->json()))->toBe(['version', 'data', 'requested', 'state', 'paging', 'capabilities']);
    expect(json_decode($response->getContent())->capabilities->fields)->toEqual(new stdClass);
    $response->assertJsonPath('paging.total', 4)->assertJsonPath('paging.filtered', 4);
});

test('rejects an empty multiple selection under the documented Reject policy', function () {
    $case = dapterFieldDemoCases()['FilterNull'][0];
    $this->call('POST', route('dapter.data', ['source' => $case->source]), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: json_encode($case->empty_request, JSON_THROW_ON_ERROR))
        ->assertStatus(422)->assertJsonPath('error.kind', 'validation');
});

test('executes the complete request displayed by the backend protocol reference', function () {
    $page = file_get_contents(resource_path('js/pages/docs/dapter/ProtocolV2.vue'));
    expect(preg_match('/const request = `([^`]+)`;/s', $page, $match))->toBe(1);
    $response = $this->call('POST', route('dapter.data', ['source' => 'Dapter.FieldsFluent']), server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'], content: $match[1])->assertOk();

    expect(array_column($response->json('data'), 'id'))->toBe([1, 2]);
    $response->assertJsonPath('paging.total', 4)
        ->assertJsonPath('paging.filtered', 2)
        ->assertJsonPath('requested.order.kind', 'fields')
        ->assertJsonPath('state.order.kind', 'terms');
});

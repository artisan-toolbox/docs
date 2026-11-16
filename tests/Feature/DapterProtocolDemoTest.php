<?php

use App\Demo\Dapter\Protocol\ProtocolFixture;

function dapterProtocolDemoCases(): array
{
    $cases = [];
    foreach (ProtocolFixture::contract()->requests as $case) {
        if (in_array($case->context, ['public', 'missing', 'server'], true)) {
            $cases[$case->id] = [$case];
        }
    }

    return $cases;
}

test('serves the public protocol corpus through the real documentation data source route', function (stdClass $case) {
    $source = match ($case->context) {
        'missing' => 'Dapter.ProtocolMissing',
        'server' => 'Dapter.ProtocolInvalidRecords',
        default => 'Dapter.ProtocolRecords',
    };
    $response = $this->call(
        'POST',
        route('dapter.data', ['source' => $source]),
        server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'],
        content: $case->request_json,
    );

    $response->assertStatus($case->status);
    expect(json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR))->toEqual($case->response);

    if ($case->status !== 200) {
        expect($response->json())->not->toHaveKeys(['data', 'requested', 'state', 'paging', 'capabilities']);
    }
})->with(fn (): array => dapterProtocolDemoCases());

test('preserves raw JSON row distinctions in the public protocol source', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.ProtocolRecords']), ['version' => 1])
        ->assertOk();
    $body = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    $values = $body->data[0]->values;

    expect($values->empty_object)->toBeInstanceOf(stdClass::class)
        ->and($values->empty_list)->toBe([])
        ->and($values->null)->toBeNull()
        ->and($values->false)->toBeFalse()
        ->and($values->zero)->toBe(0)
        ->and($values->text_zero)->toBe('0')
        ->and($values->decimal)->toBe(1.5)
        ->and($values->space)->toBe('  value  ');
});

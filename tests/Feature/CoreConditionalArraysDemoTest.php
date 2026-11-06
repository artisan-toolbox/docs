<?php

test('runs Core conditional arrays with fixed inputs and preserves falsey values and numeric keys', function (bool $includeContact, bool $includeExtraItem) {
    $options = compact('includeContact', 'includeExtraItem');
    $profile = [
        'name' => 'Alex Example',
        ...($includeContact ? ['contact' => ['email' => 'alex@example.com']] : []),
        'active' => false,
        'nickname' => null,
        'visits' => 0,
        'note' => '',
    ];
    $items = $includeExtraItem ? ['Core', 'QZ Tray', 'Mosaicast'] : [0 => 'Core', 2 => 'Mosaicast'];

    $response = $this->postJson(route('demo.core.conditional-arrays'), $options)
        ->assertOk()
        ->assertExactJson([
            'options' => $options,
            'payload' => ['profile' => $profile, 'items' => $items],
            'contactEvaluated' => $includeContact,
        ])
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');

    expect($response->headers->get('Cache-Control'))->toContain('private', 'no-store');
    $decoded = json_decode($response->getContent(), flags: JSON_THROW_ON_ERROR);
    expect(is_array($decoded->payload->items))->toBe($includeExtraItem);

    $this->postJson(route('demo.core.conditional-arrays'), $options)->assertExactJson($response->json());
})->with([
    'omit both' => [false, false],
    'include contact' => [true, false],
    'include middle item' => [false, true],
    'include both' => [true, true],
]);

test('requires both boolean options before executing the example', function (array $input, array $fields) {
    $this->postJson(route('demo.core.conditional-arrays'), $input)
        ->assertUnprocessable()->assertJsonValidationErrors($fields)
        ->assertJsonMissingPath('payload');
})->with([
    'missing options' => [[], ['includeContact', 'includeExtraItem']],
    'missing contact option' => [['includeExtraItem' => false], ['includeContact']],
    'missing item option' => [['includeContact' => false], ['includeExtraItem']],
    'invalid contact option' => [['includeContact' => 'execute()', 'includeExtraItem' => false], ['includeContact']],
    'invalid item option' => [['includeContact' => false, 'includeExtraItem' => ['another value']], ['includeExtraItem']],
]);

test('never incorporates arbitrary client content into the fixed example', function () {
    $this->postJson(route('demo.core.conditional-arrays'), [
        'includeContact' => true,
        'includeExtraItem' => false,
        'profile' => ['name' => 'Injected name', 'contact' => ['email' => 'other@example.com']],
        'code' => 'arbitrary PHP',
    ])->assertOk()
        ->assertJsonPath('payload.profile.name', 'Alex Example')
        ->assertJsonPath('payload.profile.contact.email', 'alex@example.com')
        ->assertJsonMissingPath('code')
        ->assertJsonCount(3);
});

test('limits repeated server runs of the example', function () {
    $options = ['includeContact' => false, 'includeExtraItem' => false];

    for ($run = 0; $run < 20; $run++) {
        $this->postJson(route('demo.core.conditional-arrays'), $options)->assertOk();
    }

    $this->postJson(route('demo.core.conditional-arrays'), $options)->assertTooManyRequests();
});

<?php

use App\Models\User;

test('security settings are unavailable to guests', function () {
    $this->get('/settings/security')->assertNotFound();
});

test('security settings are unavailable to authenticated users', function () {
    $this->actingAs(User::factory()->create())->get('/settings/security')->assertNotFound();
});

test('authenticated users cannot update their password through removed routes', function (string $path) {
    $user = User::factory()->create();
    $passwordHash = $user->password;

    $this->actingAs($user)->put($path, [
        'current_password' => 'password',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertNotFound();

    expect($user->refresh()->password)->toBe($passwordHash);
})->with(['/settings/password', '/user/password']);

test('password confirmation and two factor routes are unavailable', function (string $method, string $path) {
    $this->actingAs(User::factory()->create())->call($method, $path, ['password' => 'password'])
        ->assertNotFound();
})->with([
    ['GET', '/user/confirm-password'],
    ['POST', '/user/confirm-password'],
    ['POST', '/user/two-factor-authentication'],
    ['POST', '/user/confirmed-two-factor-authentication'],
    ['DELETE', '/user/two-factor-authentication'],
    ['GET', '/two-factor-challenge'],
    ['POST', '/two-factor-challenge'],
]);

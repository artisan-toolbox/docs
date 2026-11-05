<?php

use App\Models\User;

test('profile settings are unavailable to guests', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/settings', '/settings/profile', '/settings/appearance']);

test('profile settings are unavailable to authenticated users', function (string $path) {
    $this->actingAs(User::factory()->create())->get($path)->assertNotFound();
})->with(['/settings', '/settings/profile', '/settings/appearance']);

test('authenticated users cannot update their profile through removed routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->patch('/settings/profile', [
        'name' => 'Changed Name',
        'email' => 'changed@example.com',
    ])->assertNotFound();

    expect($user->refresh()->name)->not->toBe('Changed Name')
        ->and($user->email)->not->toBe('changed@example.com')
        ->and($user->hasVerifiedEmail())->toBeTrue();
});

test('authenticated users cannot delete their account through removed routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->delete('/settings/profile', ['password' => 'password'])->assertNotFound();

    $this->assertAuthenticatedAs($user);
    $this->assertModelExists($user);
});

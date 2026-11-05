<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('password reset and registration screens are unavailable', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/forgot-password', '/reset-password/example-token', '/register']);

test('password reset and registration submissions are unavailable', function (string $path) {
    Notification::fake();

    $this->post($path, [
        'name' => 'Test User',
        'email' => 'person@atb.dev.br',
        'token' => 'example-token',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertNotFound();

    Notification::assertNothingSent();
    $this->assertDatabaseCount('users', 0);
})->with(['/forgot-password', '/reset-password', '/register']);

test('authenticated users cannot access password reset or registration screens', function (string $path) {
    $this->actingAs(User::factory()->create())->get($path)->assertNotFound();
})->with(['/forgot-password', '/reset-password/example-token', '/register']);

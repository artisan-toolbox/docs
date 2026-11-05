<?php

use App\Models\User;

test('protects the log viewer and its data from guests', function () {
    $this->get('/logs')->assertRedirect('/login');
    $this->getJson('/logs/api/hosts')->assertUnauthorized();
    $this->getJson('/logs/api/files')->assertUnauthorized();
    $this->getJson('/logs/api/files/example/download?signature=invalid')->assertUnauthorized();
});

test('denies log access to authenticated users outside the staff domain', function (string $email) {
    $this->actingAs(User::factory()->create(['email' => $email]));
    $this->get('/logs')->assertForbidden();
    $this->getJson('/logs/api/hosts')->assertForbidden();
})->with(['outsider@example.com', 'staff@atp.dev.br']);

test('denies log access until the staff email has been verified', function () {
    $this->actingAs(User::factory()->unverified()->create(['email' => 'staff@atb.dev.br']));
    $this->get('/logs')->assertForbidden();
    $this->getJson('/logs/api/hosts')->assertForbidden();
});

test('allows verified staff to open the log viewer and its API', function () {
    $this->actingAs(User::factory()->create(['email' => 'staff@atb.dev.br']));
    $this->get('/logs')->assertOk();
    $this->getJson('/logs/api/hosts')->assertOk();
});

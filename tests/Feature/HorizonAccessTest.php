<?php

use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('protects the Horizon dashboard and API from guests', function () {
    $this->get('/horizon')->assertRedirect('/login');
    $this->getJson('/horizon/api/stats')->assertUnauthorized();
});

test('denies Horizon access to authenticated users outside the staff domain in every environment', function (string $environment) {
    app()->instance('env', $environment);
    $user = User::factory()->create(['email' => 'outsider@example.com']);
    $this->actingAs($user);

    expect(Gate::forUser($user)->allows('viewHorizon'))->toBeFalse();
    $this->get('/horizon')->assertForbidden();
    $this->getJson('/horizon/api/stats')->assertForbidden();
})->with(['local', 'production']);

test('denies Horizon access until the staff email has been verified', function () {
    $user = User::factory()->unverified()->create(['email' => 'staff@atb.dev.br']);
    $this->actingAs($user);

    expect(Gate::forUser($user)->allows('viewHorizon'))->toBeFalse();
    $this->get('/horizon')->assertForbidden();
    $this->getJson('/horizon/api/stats')->assertForbidden();
});

test('allows verified staff to open Horizon and its API', function () {
    $user = User::factory()->create(['email' => 'staff@atb.dev.br']);
    $this->actingAs($user);

    expect(Gate::forUser($user)->allows('viewHorizon'))->toBeTrue();
    $this->get('/horizon')->assertOk();
    $this->getJson('/horizon/api/batches')->assertOk()->assertExactJson(['batches' => []]);
});

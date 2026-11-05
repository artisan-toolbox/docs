<?php

use App\Models\User;

test('the dashboard is unavailable to guests', function () {
    $this->get('/dashboard')->assertNotFound();
});

test('the dashboard is unavailable to authenticated users', function () {
    $this->actingAs(User::factory()->create())->get('/dashboard')->assertNotFound();
});

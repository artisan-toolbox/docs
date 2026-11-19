<?php

use Inertia\Testing\AssertableInertia as Assert;

test('advertises the same fictional provider in both permission editor guides', function (string $slug, string $component) {
    $this->withoutVite()
        ->get('/docs/'.$slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/'.$component)
            ->where('userPermissionEditor', [
                'version' => 1,
                'endpoint' => '/demo/front-awesome/permission-editor',
            ])
            ->where('permissionEditorDemoExport', '/demo/front-awesome/permission-editor/export'));

    $this->get('/packages/'.$slug)->assertRedirect('/docs/'.$slug);
})->with([
    ['front-awesome/user-permission-editor', 'front-awesome/PermissionEditor'],
    ['permit/management', 'permit/Management'],
]);

test('gates the sample CSV with the saved assignment and keeps unknown subjects out', function () {
    $assignments = '/demo/front-awesome/permission-editor?user=42';
    $jordan = '/demo/front-awesome/permission-editor/export?user=42';
    $avery = '/demo/front-awesome/permission-editor/export?user=77';

    $this->get($jordan)->assertForbidden();
    $this->get($avery)->assertOk()->assertSee('1,Field notes');
    $this->get('/demo/front-awesome/permission-editor/export?user=99')->assertNotFound();

    $initial = $this->getJson($assignments)->assertOk()->json();
    $this->putJson($assignments, [
        'revision' => $initial['revision'],
        'values' => array_replace($initial['values'], ['notebooks::export' => true]),
    ])->assertNoContent();
    $this->get($jordan)
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertSee('2,Release checklist');

    $current = $this->getJson($assignments)->assertOk()->json();
    $this->putJson($assignments, [
        'revision' => $current['revision'],
        'values' => $initial['values'],
    ])->assertNoContent();
    $this->get($jordan)->assertForbidden();
});

test('reads and replaces fictional assignments through the editor protocol', function () {
    $endpoint = '/demo/front-awesome/permission-editor?user=42';
    $initial = $this->getJson($endpoint)
        ->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertJsonPath('subject', '42')
        ->assertJsonPath('canUpdate', true)
        ->assertJsonPath('sections.1.order', 'locked')
        ->assertJsonPath('sections.1.abilities.2.key', 'workflow::publish')
        ->assertJsonPath('values.notebooks::export', false)
        ->json();
    $values = array_replace($initial['values'], ['notebooks::export' => true]);

    $this->putJson($endpoint, ['revision' => $initial['revision'], 'values' => $values])
        ->assertNoContent()
        ->assertHeader('Cache-Control', 'no-store, private');

    $saved = $this->getJson($endpoint)
        ->assertOk()
        ->assertJsonPath('values.notebooks::export', true)
        ->json();

    expect($saved['revision'])->not->toBe($initial['revision']);
    $this->putJson($endpoint, ['revision' => $initial['revision'], 'values' => $initial['values']])
        ->assertConflict();
    $this->getJson($endpoint)->assertJsonPath('values.notebooks::export', true);
});

test('keeps read-only and unknown demo subjects out of writes', function () {
    $viewer = '/demo/front-awesome/permission-editor?user=77';
    $this->getJson($viewer)->assertOk()->assertJsonPath('canUpdate', false);
    $this->putJson($viewer)->assertForbidden();
    $this->getJson('/demo/front-awesome/permission-editor?user=99')->assertNotFound();
    $this->putJson('/demo/front-awesome/permission-editor?user=99')->assertNotFound();
});

test('rejects invalid values without changing the fictional session state', function () {
    $endpoint = '/demo/front-awesome/permission-editor?user=42';
    $initial = $this->getJson($endpoint)->assertOk()->json();

    $this->putJson($endpoint, [
        'revision' => $initial['revision'],
        'values' => array_replace($initial['values'], ['notebooks::export' => 'true']),
    ])->assertUnprocessable();
    $this->putJson($endpoint, [
        'revision' => $initial['revision'],
        'values' => ['notebooks::export' => true],
    ])->assertUnprocessable();

    $this->getJson($endpoint)
        ->assertJsonPath('revision', $initial['revision'])
        ->assertJsonPath('values.notebooks::export', false);
});

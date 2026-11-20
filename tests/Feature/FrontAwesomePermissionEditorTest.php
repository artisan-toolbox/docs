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

test('limits the sample CSV to known subjects', function () {
    $this->get('/demo/front-awesome/permission-editor/export?user=77')->assertOk()->assertSee('1,Field notes');
    $this->get('/demo/front-awesome/permission-editor/export?user=99')->assertNotFound();
});

test('grants and revokes CSV access through the editor revision protocol', function () {
    $endpoint = '/demo/front-awesome/permission-editor?user=42';
    $export = '/demo/front-awesome/permission-editor/export?user=42';

    $this->get($export)->assertForbidden();

    $initial = $this->getJson($endpoint)
        ->assertOk()
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertJsonPath('subject', '42')
        ->assertJsonPath('canUpdate', true)
        ->assertJsonPath('iconFamily', 'classic')
        ->assertJsonPath('sections.0.icon', 'book-open')
        ->assertJsonPath('sections.0.abilities.0.icon', 'file-export')
        ->assertJsonPath('sections.1.order', 'locked')
        ->assertJsonPath('sections.1.abilities.2.key', 'workflow::publish')
        ->assertJsonMissingPath('sections.1.icon')
        ->assertJsonMissingPath('sections.1.abilities.0.icon')
        ->assertJsonPath('sections.2.kind', 'roles')
        ->assertJsonPath('values.role::publisher', true)
        ->assertJsonPath('values.role::reviewer', false)
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
    $this->get($export)
        ->assertOk()
        ->assertHeader('Content-Type', 'text/csv; charset=UTF-8')
        ->assertHeader('Cache-Control', 'no-store, private')
        ->assertSee('2,Release checklist');

    $this->putJson($endpoint, ['revision' => $saved['revision'], 'values' => $initial['values']])
        ->assertNoContent();
    $this->get($export)->assertForbidden();
});

test('keeps existing session edits when the demo catalog adds an assignment', function () {
    $endpoint = '/demo/front-awesome/permission-editor?user=42';
    $original = $this->getJson($endpoint)->assertOk()->json('values');
    unset($original['role::publisher']);
    $original['notebooks::export'] = true;

    $current = $this->withSession([
        'docs.front-awesome.permission-editor' => [
            'revision' => 'previous-session',
            'values' => $original,
        ],
    ])->getJson($endpoint)
        ->assertOk()
        ->assertJsonPath('revision', 'previous-session')
        ->assertJsonPath('values.notebooks::export', true)
        ->assertJsonPath('values.role::publisher', true)
        ->json();

    $this->putJson($endpoint, ['revision' => $current['revision'], 'values' => $current['values']])
        ->assertNoContent();
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

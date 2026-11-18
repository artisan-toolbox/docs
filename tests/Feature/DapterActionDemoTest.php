<?php

use App\Demo\Dapter\Actions\State;
use Illuminate\Http\UploadedFile;

function actionDemoUrl(string $action, string $source = 'Dapter.ActionCatalog', mixed $target = null): string
{
    return route('dapter.action', ['source' => $source, 'action' => $action, ...($target === null ? [] : ['target' => $target])]);
}

test('exposes only gate-authorized metadata in both read protocols and revokes stale authority', function () {
    $this->postJson(route('dapter.data', ['source' => 'Dapter.ActionCatalog']), ['version' => 1])->assertOk()->assertJsonMissingPath('actions');
    $this->postJson(route('demo.dapter.actions.start'))->assertOk()->assertJsonPath('count', 0);
    foreach ([1, 2] as $version) {
        $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.ActionCatalog']), ['version' => $version])->assertOk();
        $response->assertJsonMissingPath('actions.formOnly')->assertJsonPath('actions.save.method', 'post')->assertJsonPath('actions.record.target.input', 'recordId')->assertJsonPath('actions.record.target.valueType', 'integer')->assertJsonCount(1, 'actions.record.target.values')->assertJsonPath('actions.record.target.values.0.value', 1);
        if (getenv('UPDATE_DAPTER_WIRE_FIXTURES') !== '1') {
            expect(json_decode($response->getContent()))->toEqual(json_decode(file_get_contents(base_path('resources/js/components/demo/dapter/actions/wire-v'.$version.'.json'))));
        }
        if (getenv('UPDATE_DAPTER_WIRE_FIXTURES') === '1') {
            file_put_contents(base_path('resources/js/components/demo/dapter/actions/wire-v'.$version.'.json'), json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
        }
    }
    $this->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $this->postJson(route('demo.dapter.actions.revoke'))->assertOk();
    $this->postJson(actionDemoUrl('save'), ['name' => 'Ada'])->assertForbidden();
    expect(State::count())->toBe(0);
});

test('uses native validation redirects JSON and commit uncertainty without changing reader accounts', function () {
    $this->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $this->postJson(route('demo.dapter.actions.start'))->assertOk();
    $this->postJson(actionDemoUrl('save'), ['name' => ''])->assertUnprocessable()->assertJsonValidationErrors('name');
    expect(State::count())->toBe(0);
    $this->postJson(actionDemoUrl('save'), ['name' => 'Ada'])->assertOk()->assertJsonPath('saved', true)->assertJsonPath('count', 1);
    $this->withHeaders(['X-Dapter-Transport' => 'visit', 'X-Inertia' => 'true', 'Accept' => 'text/html'])->post(actionDemoUrl('rename'), ['name' => 'Lin'])->assertRedirect(route('docs.show', ['slug' => 'dapter/actions']));
    expect(State::count())->toBe(2);
    $this->flushHeaders()->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $this->postJson(actionDemoUrl('uncertain'), ['name' => 'Ada'])->assertUnprocessable()->assertJsonValidationErrors('name');
    expect(State::count())->toBe(3);
    $this->postJson(actionDemoUrl('formOnly'), ['name' => 'Direct request'])->assertOk();
    expect(State::count())->toBe(4)->and(auth()->user())->toBeNull();
});

test('requires a strict record selector and reauthorizes it against the mandatory source', function () {
    $this->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $this->postJson(route('demo.dapter.actions.start'))->assertOk();
    foreach ([['recordId' => '1', 'name' => 'Ada'], ['recordId' => 2, 'name' => 'Ada'], ['recordId' => 1, 'name' => '']] as $input) {
        $response = $this->postJson(actionDemoUrl('record', target: 1), $input);
        expect($response->status())->toBeIn([403, 422]);
        expect(State::count())->toBe(0);
    }
    $this->postJson(actionDemoUrl('record', target: 1), ['recordId' => 1, 'name' => 'Ada'])->assertOk()->assertJsonPath('count', 1);
    $this->postJson(actionDemoUrl('record', target: 2), ['recordId' => 2, 'name' => 'Ada'])->assertForbidden();
    expect(State::count())->toBe(1);
});

test('discovers dedicated actions from attributes and fluent options with all declared native verbs', function () {
    $this->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $this->postJson(route('demo.dapter.actions.start'))->assertOk();
    foreach (['Dapter.ActionExternal', 'Dapter.ActionAttributes', 'Dapter.ActionConfigured'] as $source) {
        $response = $this->postJson(route('dapter.data', ['source' => $source]), ['version' => 1])->assertOk()->assertJsonPath('actions.defaultVisit.method', 'post')->assertJsonPath('actions.defaultVisit.transports', ['visit']);
        foreach (['replace' => 'put', 'amend' => 'patch', 'remove' => 'delete'] as $action => $method) {
            $response->assertJsonPath('actions.'.$action.'.method', $method);
            $this->{$method.'Json'}(actionDemoUrl($action, $source, $source === 'Dapter.ActionConfigured' && $action === 'replace' ? 1 : null), ['name' => 'Ada', ...($source === 'Dapter.ActionConfigured' && $action === 'replace' ? ['recordId' => 1] : [])])->assertOk();
        }
    }
    expect(State::count())->toBe(9);
});

test('accepts native multipart files and only canonical integer selectors', function () {
    $this->postJson(route('demo.dapter.actions.start'))->assertOk();
    $this->withHeaders(['Accept' => 'application/json', 'X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    $file = UploadedFile::fake()->createWithContent('fictional.txt', 'fictional attachment');
    $this->post(actionDemoUrl('record', target: 1), ['recordId' => '1', 'name' => 'Ada', 'attachment' => $file], ['Content-Type' => 'multipart/form-data'])->assertOk()->assertJsonPath('uploaded', true)->assertJsonPath('count', 1);
    $this->post(actionDemoUrl('record', target: 1), ['recordId' => '01', 'name' => 'Ada', 'attachment' => $file], ['Content-Type' => 'multipart/form-data'])->assertUnprocessable();
    expect(State::count())->toBe(1);
});

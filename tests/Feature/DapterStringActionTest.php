<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;

test('lets a guest inspect exactly the fictional records through their advertised URLs', function () {
    $source = 'Dapter.StringActionCatalog';
    $ids = ['{draft}', 'part/', '..', '%2F', ' key '];
    $listing = $this->postJson(route('dapter.data', ['source' => $source]), ['version' => 2])
        ->assertOk()
        ->assertJsonPath('actions.inspect.transports', ['http'])
        ->assertJsonPath('actions.inspect.target.input', 'recordId')
        ->assertJsonPath('actions.inspect.target.valueType', 'string');
    $targets = $listing->json('actions.inspect.target.values');
    expect(array_column($listing->json('data'), 'id'))->toBe($ids)
        ->and(array_column($targets, 'value'))->toBe($ids)
        ->and(array_keys($listing->json('actions')))->toBe(['inspect']);

    $this->withHeaders(['X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http']);
    foreach ($targets as $target) {
        $this->postJson($target['url'], ['recordId' => $target['value']])
            ->assertOk()
            ->assertExactJson(['selected' => $target['value']]);
    }

    $this->postJson($targets[0]['url'], ['recordId' => $ids[1]])->assertUnprocessable();
    $this->postJson(route('dapter.action', ['source' => $source, 'action' => 'inspect', 'target' => 'missing']), ['recordId' => 'missing'])->assertNotFound();
    expect(Gate::forUser(null)->denies('docsDapterInspectString', [['id' => 'missing']]))->toBeTrue();
    $this->assertGuest();
});

test('preserves the significant spaces of a record selector in a native file upload', function () {
    $listing = $this->postJson(route('dapter.data', ['source' => 'Dapter.StringActionCatalog']), ['version' => 2])->assertOk();
    $target = collect($listing->json('actions.inspect.target.values'))->firstWhere('value', ' key ');
    $this->post($target['url'], ['recordId' => ' key ', 'attachment' => UploadedFile::fake()->createWithContent('inspection.txt', 'Read-only inspection.')], [
        'Accept' => 'application/json', 'X-Dapter-Action' => '1', 'X-Dapter-Transport' => 'http',
    ])->assertOk()->assertExactJson(['selected' => ' key ']);
});

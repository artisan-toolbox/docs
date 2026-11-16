<?php

use App\DataSources\Dapter\ScopedRecords;
use App\Demo\Dapter\SourceBoundaries\FixtureRecords;

function scopedDapterRows(): array
{
    return [
        ['id' => 101, 'name' => 'North notebook', 'studio' => 'studio-north', 'source_calls' => 1],
        ['id' => 102, 'name' => 'North pencil', 'studio' => 'studio-north', 'source_calls' => 1],
    ];
}

test('reads only scoped public rows through the real documentation endpoint on every request', function () {
    expect(FixtureRecords::all())->toHaveCount(3);
    app()->singleton(ScopedRecords::class);
    resolve(ScopedRecords::class)->source();

    foreach (range(1, 2) as $request) {
        $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.ScopedRecords']), ['version' => 1])
            ->assertOk()->assertJsonPath('version', 1)
            ->assertJsonPath('data', scopedDapterRows())
            ->assertJsonPath('paging.total', 2)->assertJsonPath('paging.filtered', 2)
            ->assertJsonPath('paging.pages', 1)->assertJsonPath('paging.per_page', 2)
            ->assertJsonPath('capabilities.paging.per_page_options', [2])
            ->assertJsonMissingPath('metadata');
        $response->assertDontSee('studio-south')->assertDontSee('South sketchbook')
            ->assertDontSee('private_note')->assertDontSee('Fixture-only');
    }
});

test('keeps browser operation intent from replacing the fixed scope or public projection', function () {
    $state = [
        'version' => 1, 'fields' => (object) [], 'global' => (object) ['studio' => 'studio-south'],
        'searchMatch' => 'all', 'order' => ['kind' => 'default'],
        'paging' => ['mode' => 'offset', 'current' => 1, 'per_page' => 2],
    ];
    $this->postJson(route('dapter.data', ['source' => 'Dapter.ScopedRecords']), ['version' => 1, 'state' => $state])
        ->assertUnprocessable()->assertJsonMissingPath('data')->assertJsonMissingPath('paging');

    $this->postJson(route('dapter.data', ['source' => 'Dapter.ScopedRecords']), ['version' => 1])
        ->assertOk()->assertJsonPath('data', scopedDapterRows());
});

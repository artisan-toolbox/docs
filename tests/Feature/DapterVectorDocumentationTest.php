<?php

use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\VectorOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use ArtisanToolbox\Dapter\Support\SourceRegistry;

test('renders the code-only vector guide without mounting an interactive vector request', function () {
    $this->withoutVite()->get(route('docs.show', ['slug' => 'dapter/vector-search']))->assertOk();
    $page = file_get_contents(resource_path('js/pages/docs/dapter/VectorSearch.vue'));
    expect($page)->toContain('new VectorOptions(', 'maxDistance: 1.0', 'inclusive L2', 'NativeVectorSearchTest');
    expect($page)->not->toContain('<ResearchDemo', '<VectorDemo');
});

test('accepts the documented public vector declaration and omits it on an unsupported collection backend', function () {
    $source = new class extends CollectionDataSource implements WithOptions
    {
        public function source(): array
        {
            return [['id' => 1, 'embedding' => [0, 0, 0]]];
        }

        public function options(): StoreOptions
        {
            return StoreOptions::make()->publicAccess()->searchableField('embedding', [MatchType::Vector], options: new FieldOptions(vector: new VectorOptions(dimensions: 3, maxDistance: 1.0)));
        }
    };
    resolve(SourceRegistry::class)->register('VectorDocumentation', $source::class);
    $this->postJson(route('dapter.data', ['source' => 'VectorDocumentation']), ['version' => 2])
        ->assertOk()->assertJsonPath('data.0.id', 1)->assertJsonMissingPath('capabilities.fields.embedding.search.vector');
});

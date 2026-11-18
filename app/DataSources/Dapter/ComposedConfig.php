<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Records;
use App\Demo\Dapter\Composed\ReverseOrder;
use App\Demo\Dapter\Composed\Status;
use App\Demo\Dapter\Composed\StatusFilter;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedConfig extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.declarations');
        try {
            config(['dapter.declarations' => [
                'fields' => [
                    'name' => ['search' => ['matchTypes' => ['contains'], 'target' => 'name', 'valueType' => 'string', 'options' => ['output' => 'name']], 'order' => ['sortTypes' => ['native'], 'directions' => ['asc', 'desc'], 'target' => 'name', 'valueType' => 'string', 'options' => ['output' => 'name']]],
                    'status' => ['filters' => ['status' => ['values' => Status::class, 'multiple' => false, 'empty' => 'clear', 'target' => 'status', 'valueType' => 'string', 'options' => ['output' => 'status']]]],
                ],
                'global' => [
                    'search' => ['name' => ['target' => 'name', 'valueType' => 'string', 'matchType' => 'contains']],
                    'filters' => ['status' => ['values' => Status::class, 'apply' => StatusFilter::class, 'multiple' => false, 'empty' => 'clear', 'valueType' => 'string', 'options' => ['binding' => ['enum' => Status::class, 'elements' => false], 'requires' => ['sourceType' => CollectionSource::class, 'databases' => [], 'driver' => 'docs_fields']]]],
                    'orders' => ['reverse' => ['label' => 'Newest first', 'apply' => ReverseOrder::class, 'options' => ['requires' => ['sourceType' => CollectionSource::class, 'databases' => [], 'driver' => 'docs_fields']]]],
                ],
                'multi_order' => ['enabled' => true, 'max' => 2],
                'search_match' => ['default' => 'all', 'allowed' => ['all', 'any']],
                'query' => ['identity' => ['columns' => [['target' => 'id', 'output' => 'id', 'valueType' => 'integer']]], 'fixedOrder' => [['field' => 'name', 'direction' => 'asc', 'sortType' => 'native']]],
            ]]);

            return StoreOptions::make()->driver('docs_fields')->publicAccess()->pageSize(4)->pageSizeOptions([4]);
        } finally {
            config(['dapter.declarations' => $previous]);
        }
    }
}

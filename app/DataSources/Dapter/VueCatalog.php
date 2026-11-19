<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Fields\FieldRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\StoreOptions;

final class VueCatalog extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->stateTtl(240)->stateKey('saved_catalog')->publicAccess()->pageSize(2)->pageSizeOptions([2, 4])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals])
            ->orderableField('name', [SortType::Natural])
            ->filterableField('category', 'category', ['paper', 'tools'])
            ->filterableField('active', 'active', [true, false])
            ->filterableField('score', 'score', [0, 1.5, 2, 10], valueType: ValueType::Number)
            ->filterableField('optional', 'optional', [null]);
    }
}

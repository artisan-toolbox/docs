<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Fields\FieldRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\EmptySelectionPolicy;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\StoreOptions;

final class FieldsFluent extends FieldRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2, 4])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals, MatchType::StartsWith, MatchType::EndsWith])
            ->orderableField('name', [SortType::Native, SortType::String, SortType::Natural])
            ->orderableField('score', [SortType::Native, SortType::Numeric], valueType: ValueType::Number)
            ->filterableField('category', 'category', ['paper', 'tools'])
            ->filterableField('category', 'categories', ['paper', 'tools'], multiple: true)
            ->filterableField('active', 'active', [true, false])
            ->filterableField('score', 'score', [0, 1.5, 2, 10], valueType: ValueType::Number)
            ->filterableField('optional', 'optional', [null], multiple: true, empty: EmptySelectionPolicy::Reject);
    }
}

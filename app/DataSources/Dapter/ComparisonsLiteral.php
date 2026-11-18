<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsLiteral extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->strictLiteralSearch()->publicAccess()->pageSize(6)->pageSizeOptions([6])
            ->searchableField('name')
            ->orderableField('name', [SortType::Native, SortType::Regular, SortType::String, SortType::Natural])
            ->orderableField('score', [SortType::Numeric], valueType: ValueType::Integer)
            ->filterableField('active', 'active', [true, false]);
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedNumeric extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->globalSearchable(['quantity' => new SearchTarget('quantity', ValueType::Integer, MatchType::Equals)]);
    }
}

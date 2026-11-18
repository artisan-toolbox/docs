<?php

namespace App\Demo\Dapter\Literal;

use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;

final class Declaration
{
    public static function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(7)->pageSizeOptions([7])
            ->searchableField('name', [MatchType::Contains, MatchType::Equals, MatchType::StartsWith, MatchType::EndsWith])
            ->globalSearchable(['name' => new SearchTarget('name')]);
    }
}

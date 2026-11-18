<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\PostgresRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Options\FullTextOptions;
use ArtisanToolbox\Dapter\Options\SearchTarget;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsPostgresGlobal extends PostgresRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])
            ->globalSearchable(['document' => new SearchTarget('title', matchType: MatchType::FullText, fullText: new FullTextOptions('pg_catalog.english'))]);
    }
}

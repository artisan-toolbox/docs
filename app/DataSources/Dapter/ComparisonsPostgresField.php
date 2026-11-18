<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\PostgresRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\FullTextOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsPostgresField extends PostgresRecords implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])
            ->searchableField('title', [MatchType::Contains, MatchType::FullText], options: new FieldOptions(fullText: new FullTextOptions('pg_catalog.english')));
    }
}

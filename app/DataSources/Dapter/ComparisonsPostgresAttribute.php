<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\PostgresRecords;
use ArtisanToolbox\Dapter\Attributes\GlobalSearch;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Attributes\SearchableField;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\FullTextOptions;
use ArtisanToolbox\Dapter\Options\SearchTarget;

#[PublicAccess]
#[PageSize(4)]
#[SearchableField('title', [MatchType::Contains, MatchType::FullText], options: new FieldOptions(fullText: new FullTextOptions('pg_catalog.english')))]
#[GlobalSearch(['document' => new SearchTarget('title', matchType: MatchType::FullText, fullText: new FullTextOptions('pg_catalog.english'))])]
final class ComparisonsPostgresAttribute extends PostgresRecords {}

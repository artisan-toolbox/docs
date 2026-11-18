<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Fields\FieldRecords;
use ArtisanToolbox\Dapter\Attributes\FilterableField;
use ArtisanToolbox\Dapter\Attributes\OrderableField;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Attributes\SearchableField;
use ArtisanToolbox\Dapter\Enums\MatchType;

#[PublicAccess]
#[PageSize(2)]
#[SearchableField('title', [MatchType::Contains], target: 'name')]
#[OrderableField('title', target: 'name')]
#[FilterableField('category', 'category', ['paper', 'tools'])]
class FieldsAttributes extends FieldRecords {}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\Guard;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\Paging;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Enums\PagingMode;

#[Paging(PagingMode::Offset)]
#[PageSize(7)]
#[PageSizeOptions([3, 7])]
#[Guard('dapter-demo-guest')]
#[PublicAccess]
final class CollectionAttributes extends CollectionFixture {}

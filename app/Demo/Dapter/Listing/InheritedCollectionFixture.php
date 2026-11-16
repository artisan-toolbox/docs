<?php

namespace App\Demo\Dapter\Listing;

use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PageSizeOptions;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;

#[PageSize(7)]
#[PageSizeOptions([3, 7])]
#[PublicAccess]
abstract class InheritedCollectionFixture extends CollectionFixture {}

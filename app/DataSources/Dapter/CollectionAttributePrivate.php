<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\Guard;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;

#[Guard('dapter-demo-guest')]
#[PublicAccess(false)]
final class CollectionAttributePrivate extends CollectionFixture {}

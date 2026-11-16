<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\Authorize;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;

#[PublicAccess]
#[Authorize('dapter-demo-deny', ['catalog'])]
final class CollectionGateDeny extends CollectionFixture {}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\Guard;

#[Guard('dapter-demo')]
final class CollectionAttributeGuard extends CollectionFixture {}

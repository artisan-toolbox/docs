<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\Guard;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

#[PublicAccess]
#[Guard('dapter-demo-guest')]
final class CollectionPublicFalse extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess(false);
    }
}

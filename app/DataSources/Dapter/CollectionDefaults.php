<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

#[PublicAccess]
final class CollectionDefaults extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make();
    }
}

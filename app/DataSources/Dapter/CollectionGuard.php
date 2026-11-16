<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionGuard extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->guard('dapter-demo');
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionGateAllow extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->authorize('dapter-demo-allow', ['catalog']);
    }
}

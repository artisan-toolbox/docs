<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\InheritedCollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionOverride extends InheritedCollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->pageSize(10);
    }
}

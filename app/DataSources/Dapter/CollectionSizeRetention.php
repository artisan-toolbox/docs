<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionSizeRetention extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(6)->pageSizeOptions([2, 10]);
    }
}

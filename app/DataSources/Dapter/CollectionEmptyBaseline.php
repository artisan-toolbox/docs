<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionEmptyBaseline extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::makeWithoutDefaults()
            ->guard('dapter-demo-guest')
            ->pagingMode(PagingMode::Offset)
            ->pageSize(4)
            ->publicAccess();
    }
}

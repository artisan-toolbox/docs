<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\CollectionFixture;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

final class CollectionFluent extends CollectionFixture implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->pagingMode(PagingMode::Offset)
            ->pageSize(5)
            ->pageSizeOptions([5, 10])
            ->publicAccess();
    }
}

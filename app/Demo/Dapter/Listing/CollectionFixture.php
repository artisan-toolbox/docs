<?php

namespace App\Demo\Dapter\Listing;

use ArtisanToolbox\Dapter\CollectionDataSource;
use Illuminate\Support\Collection;

abstract class CollectionFixture extends CollectionDataSource
{
    /** @return Collection<int, array{id: int, name: string, category: string}> */
    public function source(): Collection
    {
        return collect(FixtureProducts::rows());
    }
}

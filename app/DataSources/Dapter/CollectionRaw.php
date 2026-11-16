<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Listing\FixtureProducts;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;

#[PublicAccess]
final class CollectionRaw implements CollectionSource
{
    /** @return list<array{id: int, name: string, category: string}> */
    public function source(): array
    {
        return FixtureProducts::rows();
    }
}

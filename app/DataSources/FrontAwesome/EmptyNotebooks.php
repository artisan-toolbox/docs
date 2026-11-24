<?php

namespace App\DataSources\FrontAwesome;

use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\CollectionDataSource;

#[PublicAccess]
final class EmptyNotebooks extends CollectionDataSource
{
    /** @return list<array{id: int, name: string, shelf: string}> */
    public function source(): array
    {
        return [];
    }
}

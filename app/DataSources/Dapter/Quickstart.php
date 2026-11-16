<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\CollectionDataSource;

#[PublicAccess]
final class Quickstart extends CollectionDataSource
{
    /** @return list<array{id: int, name: string, category: string}> */
    public function source(): array
    {
        return array_map(fn (int $id): array => [
            'id' => $id,
            'name' => sprintf('Notebook %02d', $id),
            'category' => $id % 2 === 0 ? 'Squared' : 'Plain',
        ], range(1, 23));
    }
}

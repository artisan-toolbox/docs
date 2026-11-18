<?php

namespace App\Demo\Dapter\Paging;

use ArtisanToolbox\Dapter\CollectionDataSource;

abstract class Records extends CollectionDataSource
{
    /** @return list<array{id: int, name: string, rank: int, tenant: int}> */
    public function source(): array
    {
        return array_map(fn (int $id): array => [
            'id' => $id, 'name' => sprintf('Notebook %02d', $id),
            'rank' => intdiv($id - 1, 2), 'tenant' => 1,
        ], range(1, 7));
    }
}

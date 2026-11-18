<?php

namespace App\Demo\Dapter\Composed;

use ArtisanToolbox\Dapter\CollectionDataSource;
use Illuminate\Support\Collection;

abstract class Records extends CollectionDataSource
{
    public static int $constructed = 0;

    public static int $applied = 0;

    /** @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}> */
    public function source(): Collection
    {
        return collect([
            ['id' => 1, 'name' => 'Notebook 10', 'quantity' => 0, 'status' => 'active', 'rank' => 1],
            ['id' => 2, 'name' => 'Notebook 2', 'quantity' => 2, 'status' => 'paused', 'rank' => 1],
            ['id' => 3, 'name' => 'Pencil', 'quantity' => 0, 'status' => 'active', 'rank' => 2],
            ['id' => 4, 'name' => 'Paper', 'quantity' => 4, 'status' => 'active', 'rank' => 2],
        ]);
    }
}

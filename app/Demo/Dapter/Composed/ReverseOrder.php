<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Support\Collection;

final class ReverseOrder
{
    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    public function __invoke(Collection $source): Collection
    {
        return $source->sortByDesc('id')->values();
    }
}

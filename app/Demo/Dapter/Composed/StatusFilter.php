<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Support\Collection;

final class StatusFilter
{
    public function __construct()
    {
        Records::$constructed++;
    }

    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    public function __invoke(Collection $source, ?Status $value): Collection
    {
        Records::$applied++;

        return $source->where('status', $value?->value)->values();
    }
}

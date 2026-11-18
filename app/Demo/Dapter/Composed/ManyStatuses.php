<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Support\Collection;

final class ManyStatuses
{
    public function __construct()
    {
        Records::$constructed++;
    }

    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @param  list<Status>  $values
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    public function __invoke(Collection $source, array $values): Collection
    {
        Records::$applied++;

        return $source->whereIn('status', array_map(static fn (Status $value): string => $value->value, $values))->values();
    }
}

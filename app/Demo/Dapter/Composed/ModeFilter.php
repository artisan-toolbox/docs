<?php

namespace App\Demo\Dapter\Composed;

use Illuminate\Support\Collection;

final class ModeFilter
{
    public function __construct()
    {
        Records::$constructed++;
    }

    /**
     * @param  Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>  $source
     * @return Collection<int, array{id: int, name: string, quantity: int, status: string, rank: int}>
     */
    public function __invoke(Collection $source, Mode $mode): Collection
    {
        Records::$applied++;

        return $source->where('status', $mode === Mode::Open ? 'active' : 'paused')->values();
    }
}

<?php

namespace App\Demo\Dapter\Composed;

use ArtisanToolbox\Dapter\Options\CountQueries;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final class NativeCounts
{
    /**
     * @param  Builder<Model>  $total
     * @param  Builder<Model>  $filtered
     */
    public function __invoke(Builder $total, Builder $filtered): CountQueries
    {
        return new CountQueries($total->reorder()->selectRaw('count(*) as aggregate'), $filtered->reorder()->selectRaw('count(*) as aggregate'));
    }
}

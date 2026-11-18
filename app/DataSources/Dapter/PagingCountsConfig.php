<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\StoreOptions;

final class PagingCountsConfig extends PagingSimple
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.paging.exact_counts');
        try {
            config(['dapter.paging.exact_counts' => true]);

            return parent::options();
        } finally {
            config(['dapter.paging.exact_counts' => $previous]);
        }
    }
}

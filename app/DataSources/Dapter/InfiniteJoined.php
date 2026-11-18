<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\StoreOptions;

final class InfiniteJoined extends ComposedJoin
{
    public function options(): StoreOptions
    {
        return parent::options()->pageSize(1)->pageSizeOptions([1]);
    }
}

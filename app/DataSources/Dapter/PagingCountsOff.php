<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\Records;
use ArtisanToolbox\Dapter\Attributes\ExactCounts;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

#[ExactCounts]
final class PagingCountsOff extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::makeWithoutDefaults()->guard('web')->publicAccess()->pageSize(2)
            ->pageSizeOptions([2, 3])->pagingMode(PagingMode::Simple)->exactCounts(false);
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

final class PagingDriver extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->driver('docs_paging')
            ->pagingMode(PagingMode::Simple)->pageSize(2)->pageSizeOptions([2, 3]);
    }
}

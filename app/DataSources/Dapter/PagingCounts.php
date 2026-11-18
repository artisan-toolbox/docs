<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\StoreOptions;

final class PagingCounts extends PagingCursor
{
    public function options(): StoreOptions
    {
        return parent::options()->exactCounts();
    }
}

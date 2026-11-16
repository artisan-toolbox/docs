<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

final class ProtocolInvalidRecords extends CollectionDataSource implements WithOptions
{
    public function source(): Collection
    {
        return collect([]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->pagingMode(PagingMode::Offset)
            ->pageSize(0)
            ->pageSizeOptions([2, 3])
            ->publicAccess();
    }
}

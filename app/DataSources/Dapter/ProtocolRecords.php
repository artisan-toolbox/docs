<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Protocol\ProtocolFixture;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;
use stdClass;

final class ProtocolRecords extends CollectionDataSource implements WithOptions
{
    /** @return Collection<int, stdClass> */
    public function source(): Collection
    {
        return collect(ProtocolFixture::contract()->fixture->rows);
    }

    public function options(): StoreOptions
    {
        $fixture = ProtocolFixture::contract()->fixture;

        return StoreOptions::make()
            ->pagingMode(PagingMode::Offset)
            ->pageSize($fixture->per_page)
            ->pageSizeOptions($fixture->per_page_options)
            ->publicAccess();
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\SourceBoundaries\FixtureRecords;
use App\Demo\Dapter\SourceBoundaries\PublicRecord;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

final class ScopedRecords extends CollectionDataSource implements WithOptions
{
    private int $sourceCalls = 0;

    /** @return Collection<int, PublicRecord> */
    public function source(): Collection
    {
        $sourceCalls = ++$this->sourceCalls;

        return collect(FixtureRecords::all())
            ->where('studio', 'studio-north')
            ->map(fn (array $record): PublicRecord => new PublicRecord($record, $sourceCalls))
            ->values();
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->pagingMode(PagingMode::Offset)
            ->pageSize(2)
            ->pageSizeOptions([2])
            ->publicAccess();
    }
}

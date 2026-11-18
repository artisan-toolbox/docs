<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\NativeCounts;
use App\Demo\Dapter\Composed\SqliteRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteRecords> */
final class ComposedCounts extends EloquentDataSource implements WithOptions
{
    /** @return Builder<SqliteRecords> */
    public function source(): Builder
    {
        return SqliteRecords::fixture()->whereHas('lines', static fn (Builder $query): Builder => $query->where('amount', '>=', 6));
    }

    public function options(): StoreOptions
    {
        $before = config('dapter.declarations');
        try {
            config(['dapter.declarations' => ['query' => ['counts' => NativeCounts::class]]]);

            return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->searchableField('name');
        } finally {
            config(['dapter.declarations' => $before]);
        }
    }
}

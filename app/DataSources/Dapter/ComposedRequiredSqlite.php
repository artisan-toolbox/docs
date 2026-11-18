<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\SqliteRecords;
use ArtisanToolbox\Dapter\Contracts\EloquentSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\Options\HandlerOptions;
use ArtisanToolbox\Dapter\Options\HandlerRequirements;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteRecords> */
final class ComposedRequiredSqlite extends EloquentDataSource implements WithOptions
{
    /** @return Builder<SqliteRecords> */
    public function source(): Builder
    {
        return SqliteRecords::fixture();
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->globalFilterable('name', ['Notebook'], static fn (Builder $query, string $name): Builder => $query->where('name', $name), options: new HandlerOptions(requires: new HandlerRequirements(sourceType: EloquentSource::class, databases: ['sqlite'])));
    }
}

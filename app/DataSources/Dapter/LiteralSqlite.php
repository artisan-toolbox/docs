<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Literal\Declaration;
use App\Demo\Dapter\Literal\SqliteRecord;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteRecord> */
final class LiteralSqlite extends EloquentDataSource implements WithOptions
{
    /** @return Builder<SqliteRecord> */
    public function source(): Builder
    {
        return SqliteRecord::query()->where('tenant', 1);
    }

    public function options(): StoreOptions
    {
        return Declaration::options();
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\SqliteNotebook;
use ArtisanToolbox\Dapter\Contracts\WithCursorScope;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteNotebook> */
final class PagingNative extends EloquentDataSource implements WithCursorScope, WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pagingMode(PagingMode::Cursor)
            ->pageSize(2)->pageSizeOptions([2, 3])->searchableField('name')->orderableField('name');
    }

    public function cursorScope(): string
    {
        return 'fictional-sqlite:tenant-1:permission-v1:query-v1';
    }

    /** @return Builder<SqliteNotebook> */
    public function source(): Builder
    {
        return SqliteNotebook::fixture();
    }
}

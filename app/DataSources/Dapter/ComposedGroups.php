<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\SqliteRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteRecords> */
final class ComposedGroups extends EloquentDataSource implements WithOptions
{
    /** @return Builder<SqliteRecords> */
    public function source(): Builder
    {
        return SqliteRecords::fixture()->join('demo_dapter_lines as lines', 'lines.record_id', '=', 'demo_dapter_records.id')->select(['demo_dapter_records.id as record_id', 'demo_dapter_records.name'])->selectRaw('sum(lines.amount) as total')->groupBy('demo_dapter_records.id', 'demo_dapter_records.name')->havingRaw('sum(lines.amount) >= ?', [7]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->query(new QueryOptions(new ResultIdentity([new IdentityColumn('demo_dapter_records.id', 'record_id', ValueType::Integer)])))->orderableField('total', valueType: ValueType::Number);
    }
}

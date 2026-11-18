<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\SqliteRecords;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\Enums\MatchType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;

/** @extends EloquentDataSource<SqliteRecords> */
class ComposedJoin extends EloquentDataSource implements WithOptions
{
    /** @return Builder<SqliteRecords> */
    public function source(): Builder
    {
        return SqliteRecords::fixture()->join('demo_dapter_lines as lines', 'lines.record_id', '=', 'demo_dapter_records.id')->select(['demo_dapter_records.id as record_id', 'lines.id as line_id', 'demo_dapter_records.name as label', 'lines.amount']);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->query(new QueryOptions(new ResultIdentity([new IdentityColumn('demo_dapter_records.id', 'record_id', ValueType::Integer), new IdentityColumn('lines.id', 'line_id', ValueType::Integer)])))->searchableField('label', [MatchType::Equals], target: 'demo_dapter_records.name', options: new FieldOptions('label'))->orderableField('amount', target: 'lines.amount', valueType: ValueType::Integer, options: new FieldOptions('amount'));
    }
}

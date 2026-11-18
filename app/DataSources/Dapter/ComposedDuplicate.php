<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedDuplicate extends ComposedJoin
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->query(new QueryOptions(new ResultIdentity([new IdentityColumn('demo_dapter_records.id', 'record_id', ValueType::Integer)])));
    }
}

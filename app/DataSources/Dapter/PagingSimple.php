<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Paging\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

class PagingSimple extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return $this->declaration()->pagingMode(PagingMode::Simple);
    }

    protected function declaration(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(2)->pageSizeOptions([2, 3])
            ->searchableField('name')->orderableField('name', valueType: ValueType::String)
            ->orderableField('rank', valueType: ValueType::Integer)->multiOrder(true, max: 2)
            ->globalOrderable('reverse', 'Newest first', static fn (Collection $rows): Collection => $rows->reverse()->values())
            ->query(new QueryOptions(new ResultIdentity([new IdentityColumn('id', 'id', ValueType::Integer)])));
    }
}

<?php

namespace App\DataSources\FrontAwesome;

use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\IdentityColumn;
use ArtisanToolbox\Dapter\Options\QueryOptions;
use ArtisanToolbox\Dapter\Options\ResultIdentity;
use ArtisanToolbox\Dapter\StoreOptions;

final class PressSchedule extends CollectionDataSource implements WithOptions
{
    /** @return list<array{id: int, job: string, due: string, sheets: int}> */
    public function source(): array
    {
        return [
            ['id' => 204, 'job' => 'Foil invitations', 'due' => '10:00', 'sheets' => 500],
            ['id' => 202, 'job' => 'Museum guide', 'due' => '10:00', 'sheets' => 1200],
            ['id' => 205, 'job' => 'Store signs', 'due' => '11:00', 'sheets' => 300],
            ['id' => 201, 'job' => 'Coffee sleeves', 'due' => '10:00', 'sheets' => 500],
            ['id' => 203, 'job' => 'Festival map', 'due' => '11:00', 'sheets' => 900],
        ];
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(5)->pageSizeOptions([5])
            ->orderableField('due')
            ->orderableField('sheets', [SortType::Numeric], valueType: ValueType::Integer)
            ->multiOrder(true, max: 2)
            ->query(new QueryOptions(identity: new ResultIdentity([
                new IdentityColumn('id', 'id', ValueType::Integer),
            ])));
    }
}

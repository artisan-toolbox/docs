<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Attributes\WithoutGlobalFilter;
use ArtisanToolbox\Dapter\Attributes\WithoutGlobalOrder;
use ArtisanToolbox\Dapter\Attributes\WithoutGlobalSearch;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

#[WithoutGlobalSearch]
#[WithoutGlobalFilter('status')]
#[WithoutGlobalOrder('reverse')]
final class ComposedRemoved extends ComposedAttributes implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->withoutGlobalSearch()->withoutGlobalFilter('external')->withoutGlobalOrder('external');
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\PagingMode;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedWithoutDefaults extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        $previous = config('dapter.declarations');
        try {
            config(['dapter.declarations' => ['global' => ['search' => ['name' => ['target' => 'name']]]]]);

            return StoreOptions::makeWithoutDefaults()->publicAccess()->guard('web')->pagingMode(PagingMode::Offset)->pageSize(4)->pageSizeOptions([4]);
        } finally {
            config(['dapter.declarations' => $previous]);
        }
    }
}

<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class FieldsRemoved extends FieldsAttributes implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()
            ->withoutFieldSearch('title')
            ->withoutFieldOrder('title')
            ->withoutFieldFilter('category', 'category');
    }
}

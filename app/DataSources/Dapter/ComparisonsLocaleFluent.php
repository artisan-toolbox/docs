<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\LocaleOptions;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComparisonsLocaleFluent extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(6)->pageSizeOptions([6])
            ->orderableField('name', [SortType::String, SortType::Locale], valueType: ValueType::String,
                options: new FieldOptions(locale: new LocaleOptions('pt-BR')));
    }
}

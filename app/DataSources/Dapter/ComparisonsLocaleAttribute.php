<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Comparisons\Records;
use ArtisanToolbox\Dapter\Attributes\OrderableField;
use ArtisanToolbox\Dapter\Attributes\PageSize;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Enums\SortType;
use ArtisanToolbox\Dapter\Enums\ValueType;
use ArtisanToolbox\Dapter\Options\FieldOptions;
use ArtisanToolbox\Dapter\Options\LocaleOptions;

#[PublicAccess]
#[PageSize(6)]
#[OrderableField('name', [SortType::String, SortType::Locale], valueType: ValueType::String,
    options: new FieldOptions(locale: new LocaleOptions('pt-BR')))]
final class ComparisonsLocaleAttribute extends Records {}

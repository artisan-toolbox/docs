<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Literal\Declaration;
use App\Demo\Dapter\Literal\Records;
use ArtisanToolbox\Dapter\Attributes\StrictLiteralSearch;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

#[StrictLiteralSearch]
class LiteralStrictAttribute extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return Declaration::options();
    }
}

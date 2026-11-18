<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Literal\Declaration;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

class LiteralFalseOverride extends LiteralStrictAttribute implements WithOptions
{
    public function options(): StoreOptions
    {
        return Declaration::options()->strictLiteralSearch(false);
    }
}

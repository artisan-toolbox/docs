<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Literal\Declaration;
use App\Demo\Dapter\Literal\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

class LiteralStrictFluent extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return Declaration::options()->strictLiteralSearch();
    }
}

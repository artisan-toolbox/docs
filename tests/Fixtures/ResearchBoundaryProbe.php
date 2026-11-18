<?php

namespace Tests\Fixtures;

use App\Demo\Dapter\Literal\Declaration;
use App\Demo\Dapter\Literal\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

class ResearchBoundaryProbe extends Records implements WithOptions
{
    public static int $reads = 0;

    public function source(): array
    {
        self::$reads++;

        return parent::source();
    }

    public function options(): StoreOptions
    {
        return Declaration::options();
    }
}

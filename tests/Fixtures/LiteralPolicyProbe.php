<?php

namespace Tests\Fixtures;

use App\Demo\Dapter\Literal\Records;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;

class LiteralPolicyProbe extends Records implements WithOptions
{
    public static StoreOptions $settings;

    public static int $reads = 0;

    public function options(): StoreOptions
    {
        return self::$settings;
    }

    public function source(): array
    {
        self::$reads++;

        return parent::source();
    }
}

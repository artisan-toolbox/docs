<?php

namespace App\Demo\Dapter\Literal;

use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverRegistry;
use Illuminate\Support\Collection;

final class DemoConfiguration
{
    public static function register(): void
    {
        resolve(DriverRegistry::class)->register('docs_literal_driver', static fn (CollectionSource $source): AwareDriver => new AwareDriver(new CollectionStoreDriver(new Collection($source->source()))));
    }
}

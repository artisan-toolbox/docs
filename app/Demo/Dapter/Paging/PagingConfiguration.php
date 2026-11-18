<?php

namespace App\Demo\Dapter\Paging;

use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverRegistry;
use Illuminate\Support\Collection;

final class PagingConfiguration
{
    public static function register(): void
    {
        resolve(DriverRegistry::class)->register('docs_paging', static fn (CollectionSource $source): NotebookDriver => new NotebookDriver(new CollectionStoreDriver(new Collection($source->source()))));
    }
}

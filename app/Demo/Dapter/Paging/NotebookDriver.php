<?php

namespace App\Demo\Dapter\Paging;

use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\TraversalStoreDriver;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\CursorPage;
use ArtisanToolbox\Dapter\Drivers\CursorReadPlan;
use ArtisanToolbox\Dapter\Drivers\DriverCapabilities;
use ArtisanToolbox\Dapter\Drivers\RawPage;
use ArtisanToolbox\Dapter\Drivers\SimplePage;
use ArtisanToolbox\Dapter\Drivers\SimpleReadPlan;
use ArtisanToolbox\Dapter\Drivers\ValidatedReadPlan;

final readonly class NotebookDriver implements TraversalStoreDriver
{
    public function __construct(private CollectionStoreDriver $driver) {}

    public function capabilities(): DriverCapabilities
    {
        return new DriverCapabilities(sourceType: CollectionSource::class, simple: true);
    }

    public function execute(ValidatedReadPlan $plan): RawPage
    {
        return $this->driver->execute($plan);
    }

    public function traverse(SimpleReadPlan|CursorReadPlan $plan): SimplePage|CursorPage
    {
        return $this->driver->traverse($plan);
    }
}

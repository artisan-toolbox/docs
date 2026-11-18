<?php

namespace Tests\Fixtures;

use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\StoreDriver;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverCapabilities;
use ArtisanToolbox\Dapter\Drivers\RawPage;
use ArtisanToolbox\Dapter\Drivers\ValidatedReadPlan;

class LiteralUnawareDriver implements StoreDriver
{
    public static int $executions = 0;

    public function __construct(private CollectionStoreDriver $delegate) {}

    public function capabilities(): DriverCapabilities
    {
        return new DriverCapabilities(fieldOperations: true, sourceType: CollectionSource::class, composedOperations: true);
    }

    public function execute(ValidatedReadPlan $plan): RawPage
    {
        self::$executions++;

        return $this->delegate->execute($plan);
    }
}

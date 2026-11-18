<?php

namespace App\Demo\Dapter\Literal;

use ArtisanToolbox\Dapter\Contracts\StoreDriver;
use ArtisanToolbox\Dapter\Drivers\CollectionStoreDriver;
use ArtisanToolbox\Dapter\Drivers\DriverCapabilities;
use ArtisanToolbox\Dapter\Drivers\RawPage;
use ArtisanToolbox\Dapter\Drivers\ValidatedReadPlan;

final readonly class AwareDriver implements StoreDriver
{
    public function __construct(private CollectionStoreDriver $delegate) {}

    public function capabilities(): DriverCapabilities
    {
        $profile = $this->delegate->capabilities();

        return new DriverCapabilities(
            offset: $profile->offset,
            sortTypes: $profile->sortTypes,
            fieldOperations: $profile->fieldOperations,
            sourceType: $profile->sourceType,
            composedOperations: $profile->composedOperations,
            comparisons: $profile->comparisons,
            literalSearchPolicy: true,
        );
    }

    public function execute(ValidatedReadPlan $plan): RawPage
    {
        return $this->delegate->execute($plan);
    }
}

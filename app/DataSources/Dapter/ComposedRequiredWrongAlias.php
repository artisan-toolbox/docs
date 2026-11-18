<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Composed\Records;
use App\Demo\Dapter\Composed\Status;
use App\Demo\Dapter\Composed\StatusFilter;
use ArtisanToolbox\Dapter\Contracts\CollectionSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\Options\HandlerOptions;
use ArtisanToolbox\Dapter\Options\HandlerRequirements;
use ArtisanToolbox\Dapter\StoreOptions;

final class ComposedRequiredWrongAlias extends Records implements WithOptions
{
    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->pageSize(4)->pageSizeOptions([4])->globalFilterable('status', [Status::Active], StatusFilter::class, options: new HandlerOptions(requires: new HandlerRequirements(sourceType: CollectionSource::class, driver: 'docs_fields')));
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Attributes\PublicAccess;
use ArtisanToolbox\Dapter\Attributes\UseResource;
use ArtisanToolbox\Dapter\StoreOptions;

#[PublicAccess]
#[UseResource(NotebookResource::class)]
final class ResourceAttributes extends ResourceFluent
{
    public function options(): StoreOptions
    {
        return StoreOptions::make();
    }
}

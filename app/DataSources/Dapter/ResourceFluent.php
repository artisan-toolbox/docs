<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

class ResourceFluent extends CollectionDataSource implements WithOptions
{
    public function source(): Collection
    {
        return collect([['id' => 1, 'name' => 'Notebook 01', 'secret' => 'server-only']]);
    }

    public function options(): StoreOptions
    {
        return StoreOptions::make()->publicAccess()->useResource(NotebookResource::class);
    }
}

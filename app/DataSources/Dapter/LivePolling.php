<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\StoreOptions;

final class LivePolling extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2])->useResource(NotebookResource::class);
    }
}

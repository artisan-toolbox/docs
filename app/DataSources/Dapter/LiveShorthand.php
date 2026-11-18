<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\Audience;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\StoreOptions;

final class LiveShorthand extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        $previous = config('dapter.broadcasting.context');
        try {
            config(['dapter.broadcasting.context' => Audience::class]);

            return StoreOptions::make()->guard('docs-dapter')->useResource(NotebookResource::class)->broadcastUpdatable();
        } finally {
            config(['dapter.broadcasting.context' => $previous]);
        }
    }
}

<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\Audience;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Broadcasting\PrivateChannel;
use ArtisanToolbox\Dapter\StoreOptions;

final class LiveArrival extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2])->useResource(NotebookResource::class)
            ->broadcastUpdatable(channel: new PrivateChannel('docs.dapter.arrival.{context}', Audience::class));
    }
}

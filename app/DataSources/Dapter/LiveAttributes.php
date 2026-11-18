<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\Audience;
use App\Demo\Dapter\Live\Revision;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Attributes\BroadcastUpdatable;
use ArtisanToolbox\Dapter\Attributes\UseResource;
use ArtisanToolbox\Dapter\Broadcasting\PrivateChannel;
use ArtisanToolbox\Dapter\StoreOptions;

#[UseResource(NotebookResource::class)]
#[BroadcastUpdatable(identifierField: 'id', channel: new PrivateChannel('docs.dapter.attributes.{context}', Audience::class), revisions: Revision::class)]
final class LiveAttributes extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2]);
    }
}

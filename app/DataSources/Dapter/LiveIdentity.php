<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\Audience;
use App\Demo\Dapter\Live\Identity;
use App\Demo\Dapter\Live\Revision;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Attributes\BroadcastUpdatable;
use ArtisanToolbox\Dapter\Broadcasting\PrivateChannel;
use ArtisanToolbox\Dapter\StoreOptions;

#[BroadcastUpdatable(channel: new PrivateChannel('docs.dapter.identity.{context}', Audience::class), revisions: Revision::class, identity: Identity::class)]
final class LiveIdentity extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2])->useResource(NotebookResource::class);
    }
}

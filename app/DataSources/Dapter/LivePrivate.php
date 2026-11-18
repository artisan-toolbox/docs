<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\Audience;
use App\Demo\Dapter\Live\Fixtures;
use App\Demo\Dapter\Live\Revision;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Broadcasting\PrivateChannel;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class LivePrivate extends CollectionDataSource implements WithOptions
{
    public function __construct(protected Request $request) {}

    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2])
            ->useResource(NotebookResource::class)
            ->broadcastUpdatable(identifierField: 'id', channel: new PrivateChannel('docs.dapter.notebooks.{context}', Audience::class, 'docsDapterLiveAudience'), revisions: Revision::class);
    }

    public function options(): StoreOptions
    {
        return static::declaration();
    }

    public function source(): Collection
    {
        return collect(Fixtures::rows((string) $this->request->user()?->getAuthIdentifier()));
    }
}

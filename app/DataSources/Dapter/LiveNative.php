<?php

namespace App\DataSources\Dapter;

use App\Demo\Dapter\Live\GlobalContext;
use App\Demo\Dapter\Live\NativeIdentity;
use App\Demo\Dapter\Live\NativeNotebook;
use App\Demo\Dapter\Live\Revision;
use App\Demo\Dapter\Resources\NotebookResource;
use ArtisanToolbox\Dapter\Broadcasting\PrivateChannel;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\EloquentDataSource;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/** @extends EloquentDataSource<NativeNotebook> */
final class LiveNative extends EloquentDataSource implements WithOptions
{
    public function __construct(private Request $request) {}

    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->pageSize(2)->pageSizeOptions([2])->useResource(NotebookResource::class)
            ->broadcastUpdatable(channel: new PrivateChannel('docs.dapter.native.{context}', GlobalContext::class), revisions: Revision::class, identity: NativeIdentity::class);
    }

    public function options(): StoreOptions
    {
        return self::declaration();
    }

    /** @return Builder<NativeNotebook> */
    public function source(): Builder
    {
        return NativeNotebook::fixture((string) $this->request->user()?->getAuthIdentifier());
    }
}

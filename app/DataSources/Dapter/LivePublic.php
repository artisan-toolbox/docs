<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\Broadcasting\PublicChannel;
use ArtisanToolbox\Dapter\CollectionDataSource;
use ArtisanToolbox\Dapter\Contracts\WithOptions;
use ArtisanToolbox\Dapter\StoreOptions;
use Illuminate\Support\Collection;

final class LivePublic extends CollectionDataSource implements WithOptions
{
    public static function declaration(): StoreOptions
    {
        return StoreOptions::make()->guard('docs-dapter')->publicAccess()->broadcastUpdatable(identifierField: 'id', channel: new PublicChannel('docs.dapter.public-notebooks', 'public-notebook-v1'));
    }

    public function options(): StoreOptions
    {
        return self::declaration();
    }

    public function source(): Collection
    {
        return collect([['id' => 1, 'name' => 'Public notebook', 'secret' => 'server-only']]);
    }
}

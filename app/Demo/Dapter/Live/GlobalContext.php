<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Broadcasting\ChannelReader;
use ArtisanToolbox\Dapter\Broadcasting\GlobalAudience;
use ArtisanToolbox\Dapter\Contracts\ChannelContextResolver;

final class GlobalContext implements ChannelContextResolver
{
    public function resolve(ChannelReader $reader): ?GlobalAudience
    {
        return Fixtures::principal((string) $reader->user->getAuthIdentifier()) !== null ? new GlobalAudience('global-notebook-v1') : null;
    }
}

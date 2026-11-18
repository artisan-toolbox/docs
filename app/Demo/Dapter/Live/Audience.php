<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Broadcasting\ChannelReader;
use ArtisanToolbox\Dapter\Broadcasting\ScopedAudience;
use ArtisanToolbox\Dapter\Contracts\ChannelContextResolver;

final readonly class Audience implements ChannelContextResolver
{
    public function __construct(private string $id) {}

    public function resolve(ChannelReader $reader): ?ScopedAudience
    {
        $current = Fixtures::principal($this->id);

        return $current !== null && $reader->user->getAuthIdentifier() === $this->id
            ? new ScopedAudience('tenant-'.Fixtures::state($this->id)['tenant'], 'notebook-v1') : null;
    }
}

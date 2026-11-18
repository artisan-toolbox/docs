<?php

namespace App\DataSources\Dapter;

use ArtisanToolbox\Dapter\StoreOptions;

final class LivePollingProps extends LivePrivate
{
    public static function declaration(): StoreOptions
    {
        return LivePolling::declaration();
    }
}

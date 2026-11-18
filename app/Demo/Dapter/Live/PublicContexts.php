<?php

namespace App\Demo\Dapter\Live;

use App\DataSources\Dapter\LivePublic;
use ArtisanToolbox\Dapter\Broadcasting\ChannelReader;
use ArtisanToolbox\Dapter\Broadcasting\RestoredSource;
use ArtisanToolbox\Dapter\Contracts\DeliveryContextFactory;
use Illuminate\Http\Request;

final class PublicContexts implements DeliveryContextFactory
{
    public function capture(Request $request): string
    {
        return 'fictional-public-v1';
    }

    public function restore(string $key, ?ChannelReader $reader): ?RestoredSource
    {
        if ($key !== 'fictional-public-v1') {
            return null;
        }
        $request = Request::create('/fictional-public-reader');
        $request->setUserResolver(static fn () => null);

        return new RestoredSource($request, new LivePublic);
    }
}

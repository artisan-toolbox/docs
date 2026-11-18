<?php

namespace App\Demo\Dapter\Live;

use ArtisanToolbox\Dapter\Broadcasting\ChannelReader;
use ArtisanToolbox\Dapter\Broadcasting\RestoredSource;
use ArtisanToolbox\Dapter\Contracts\DeliveryContextFactory;
use ArtisanToolbox\Dapter\Support\SourceRegistry;
use Illuminate\Http\Request;

final class Contexts implements DeliveryContextFactory
{
    public function capture(Request $request): ?string
    {
        $id = $request->user()?->getAuthIdentifier();

        return is_string($id) && Fixtures::principal($id) !== null ? $id : null;
    }

    public function restore(string $key, ?ChannelReader $reader): ?RestoredSource
    {
        if ($reader === null || Fixtures::principal($key) === null || $reader->user->getAuthIdentifier() !== $key) {
            return null;
        }
        $request = Request::create('/fictional-dapter-reader');
        $request->setUserResolver(static fn () => $reader->user);
        $class = resolve(SourceRegistry::class)->className($reader->source);

        return new RestoredSource($request, new $class($request), ($reader->source === 'Dapter.LiveNative' ? new GlobalContext : new Audience($key)));
    }
}

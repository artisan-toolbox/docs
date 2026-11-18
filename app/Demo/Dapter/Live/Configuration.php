<?php

namespace App\Demo\Dapter\Live;

use App\DataSources\Dapter\LiveArrival;
use App\DataSources\Dapter\LiveAttributes;
use App\DataSources\Dapter\LiveIdentity;
use App\DataSources\Dapter\LiveNative;
use App\DataSources\Dapter\LivePrivate;
use App\DataSources\Dapter\LivePublic;
use App\DataSources\Dapter\LiveShorthand;
use ArtisanToolbox\Dapter\Broadcasting\ChannelReader;
use ArtisanToolbox\Dapter\Broadcasting\LiveSourceRegistration;
use ArtisanToolbox\Dapter\Support\SourceRegistry;
use Illuminate\Auth\RequestGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class Configuration
{
    public static function register(): void
    {
        config(['auth.guards.docs-dapter' => ['driver' => 'docs-dapter', 'provider' => 'docs-dapter'], 'auth.providers.docs-dapter' => ['driver' => 'docs-dapter']]);
        Auth::provider('docs-dapter', static fn (): FixtureProvider => new FixtureProvider);
        Auth::extend('docs-dapter', function ($app): RequestGuard {
            $guard = new FixtureGuard(static function (Request $request) {
                $id = $request->hasSession() ? $request->session()->get('docs.dapter.live.id') : null;

                return is_string($id) ? Fixtures::principal($id) : null;
            }, $app['request'], new FixtureProvider);
            $app->refresh('request', $guard, 'setRequest');

            return $guard;
        });
        Gate::define('docsDapterLiveAudience', static fn ($user, ChannelReader $reader): bool => $user?->getAuthIdentifier() === $reader->user->getAuthIdentifier());
        Gate::define('docsDapterLiveProducer', static fn ($user): bool => $user !== null && Fixtures::principal((string) $user->getAuthIdentifier()) !== null);
        $registry = resolve(SourceRegistry::class);
        foreach ([LiveNative::class, LivePrivate::class, LiveAttributes::class, LiveIdentity::class, LiveArrival::class, LiveShorthand::class] as $source) {
            $alias = 'Dapter.'.class_basename($source);
            $registry->registerLive($alias, new LiveSourceRegistration(source: $source, options: $source::declaration(), contexts: Contexts::class, generation: 'notebooks-v1'));
        }
        $registry->registerLive('Dapter.LivePublic', new LiveSourceRegistration(source: LivePublic::class, options: LivePublic::declaration(), contexts: PublicContexts::class, generation: 'public-notebooks-v1', publicProjection: PublicProjection::class, producerAuthorize: 'docsDapterLiveProducer'));
    }
}

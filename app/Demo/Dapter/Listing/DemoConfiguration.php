<?php

namespace App\Demo\Dapter\Listing;

use Illuminate\Auth\GenericUser;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

final class DemoConfiguration
{
    public static function register(): void
    {
        config([
            'auth.guards.dapter-demo' => ['driver' => 'dapter-demo'],
            'auth.guards.dapter-demo-guest' => ['driver' => 'dapter-demo-guest'],
        ]);

        Auth::viaRequest('dapter-demo', fn (): GenericUser => new GenericUser([
            'id' => 'dapter-demo-reader',
            'name' => 'Documentation reader',
        ]));
        Auth::viaRequest('dapter-demo-guest', fn (): null => null);
        Gate::define('dapter-demo-allow', fn (?Authenticatable $user, string $catalog): bool => $catalog === 'catalog');
        Gate::define('dapter-demo-deny', fn (?Authenticatable $user): bool => false);
    }
}

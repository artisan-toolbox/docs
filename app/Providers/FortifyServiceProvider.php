<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        Fortify::ignoreRoutes();
    }

    public function boot(): void
    {
        RateLimiter::for('login.email', function (Request $request): array {
            $email = $request->input('email');
            $emailKey = hash('sha256', is_string($email) ? strtolower(trim($email)) : '');

            return [
                Limit::perMinute(3)->by('ip-minute:'.$request->ip()),
                Limit::perHour(30)->by('ip-hour:'.$request->ip()),
                Limit::perMinute(3)->by('email-minute:'.$emailKey),
                Limit::perHour(30)->by('email-hour:'.$emailKey),
            ];
        });

        RateLimiter::for('login.code', fn (Request $request): array => [
            Limit::perMinute(10)->by('ip:'.$request->ip()),
            Limit::perMinute(10)->by('session:'.$request->session()->getId()),
        ]);
    }
}

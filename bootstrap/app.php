<?php

use App\Http\Middleware\DocumentationSearchHeaders;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventInternalIndexing;
use ArtisanToolbox\FrontAwesome\Preferences\Http\Middleware\HandlePreferences;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(PreventInternalIndexing::class);

        $middleware->prependToPriorityList(ThrottleRequests::class, DocumentationSearchHeaders::class);

        $middleware->redirectUsersTo('/docs');

        $middleware->encryptCookies(except: ['sidebar_state']);

        $middleware->web(append: [
            HandlePreferences::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->dontFlash(['code']);

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();

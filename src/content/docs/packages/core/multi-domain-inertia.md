---
title: Multi-domain Inertia Visits
description: Configure CORS and force full-page Inertia visits when navigation crosses trusted domains or subdomains.
sidebar:
  order: 2
---

Browsers cannot complete a normal Inertia XHR visit when navigation crosses hosts. For example, a link from `app.example.com` to `admin.example.com` leaves the origin used by the current page even though both hosts belong to the same Laravel application.

`HandleInertiaCrossDomainVisits` compares the destination host with the previous URL. When an Inertia `GET` request crosses hosts, it returns an Inertia location response with status `409` and an `X-Inertia-Location` header. Inertia then performs a full document visit to the destination. Non-Inertia requests, non-`GET` requests, and same-host visits continue through the middleware unchanged.

Use this middleware only when one Laravel application serves multiple trusted domains or subdomains.

## Publish the CORS configuration

Laravel applications do not publish `config/cors.php` by default. Publish it when the file is not already present:

```bash
php artisan config:publish cors
```

## Allow trusted application origins

Cover the routes involved in navigation and expose the Inertia response headers to the browser:

```php
<?php

return [
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('APP_URL', 'http://localhost'),
        env('ADMIN_URL', 'http://admin.localhost'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'x-inertia',
        'x-inertia-location',
    ],

    'max_age' => 0,

    'supports_credentials' => false,
];
```

List exact trusted origins. Do not combine wildcard origins with credentialed requests. If the hosts must share an authenticated session, configure Laravel's session cookie domain, Sanctum stateful domains when applicable, the frontend credentials option, and `supports_credentials` together. These settings form one security boundary and should not be enabled independently.

Narrow `paths` and `allowed_methods` when the application's routing structure permits it. The broad values above support navigation across all web routes.

## Prepend the middleware

Add the middleware before the rest of Laravel's `web` group in `bootstrap/app.php`:

```php
<?php

use ArtisanToolbox\Core\Middleware\HandleInertiaCrossDomainVisits;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(
            prepend: [
                HandleInertiaCrossDomainVisits::class,
            ],
        );
    })
    ->create();
```

Prepending it lets the middleware replace the cross-host XHR response before another web middleware turns it into a redirect or page response. The package does not register it automatically because applications that do not navigate across hosts do not need this behavior.

## Forward Nginx preflight requests when needed

Some Nginx configurations answer `OPTIONS` requests before Laravel can add its CORS headers. When that applies, forward preflight requests to the front controller:

```nginx
if ($request_method = OPTIONS) {
    rewrite ^ /index.php last;
}
```

Configure CORS in one layer only. When Nginx already returns the complete and correct CORS response, Laravel does not also need to process the preflight.

## Verify the integration

From one configured origin, follow an Inertia link to the other host and inspect the browser network panel. The initial cross-host request should return `409` with `X-Inertia-Location`; the browser should then perform a full document navigation to that URL. A link within the same host should remain a normal client-side Inertia visit.

If the browser blocks the initial request, verify the exact origin, request path, allowed headers, exposed response headers, and credential settings in `config/cors.php`. Also confirm that a reverse proxy is not consuming `OPTIONS` before the request reaches Laravel.

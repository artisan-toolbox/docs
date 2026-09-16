---
title: Session broadcast channels
description: Authorize a private Mosaicast channel from a Laravel session without requiring a signed-in user.
---

Mosaicast registers a private broadcast channel for each Laravel session. The channel is available to guests as well as signed-in users; authorization proves possession of the application's session cookie, not a user identity.

## Enable broadcasting in the host application

Mosaicast uses Laravel's configured broadcaster; it does not start or install a WebSocket server. Enable broadcasting in the application, for example with `php artisan install:broadcasting` and Reverb, configure its broadcast connection, and run the Reverb server in the environment that should receive events. Laravel's [broadcasting guide](https://laravel.com/framework/docs/broadcasting) covers installation, the authentication route, and Reverb's client configuration.

Keep the broadcast authentication endpoint on middleware that can read the same Laravel session cookie as the Inertia pages. Laravel normally exposes `/broadcasting/auth` when broadcasting is installed; if that route is absent, register the application's channel routes using Laravel's normal broadcasting setup. Mosaicast registers its own channel rule automatically, so the host application does not need to duplicate it in `routes/channels.php`.

## Channel identity

Mosaicast derives an opaque session identifier with HMAC-SHA-256:

```text
HMAC-SHA-256(session ID, session channel key)
```

The raw Laravel session ID is never used in a channel name or exposed to the browser. By default, the private channel name is:

```text
private-mosaicast.sessions.{session-identifier}
```

Laravel adds the `private-` prefix to its wire-level channel name. Pass `mosaicast.sessions.{identifier}` without that prefix to Echo's `private()` method. The Vue plugin does this using the identifier received in Inertia props.

The opaque identifier is always a lowercase, 64-character SHA-256 HMAC. It cannot be reversed into the session ID, and private-channel authorization still requires the matching session cookie. The identifier alone does not authorize a subscription. Avoid persisting it, putting it in URLs, or sharing it with another person.

## Authorization requirements

Mosaicast registers the channel authorization rule and the `mosaicast-session` guard automatically. The guard identifies the current session through its HMAC identifier; the channel rule admits only an identifier that matches it. This works for guests and signed-in users, but it does not grant any application permissions.

Use the same Echo/Reverb connection and authorization endpoint as other private channels in the application. A successful subscription to `mosaicast.sessions.{identifier}` proves that the authorization request owns the matching session cookie; a signed-in application user is not required.

If the browser never requests channel authorization, verify that the Inertia page contains `mosaicastSessionIdentifier`, an Echo instance is passed to `createMosaicast`, and broadcasting is enabled. If authorization is rejected, verify that `/broadcasting/auth` receives the session cookie, the requested channel name uses the configured prefix, and any cross-origin setup permits stateful requests from the frontend origin.

## Configuration

The session channel key defaults to `APP_KEY`. The application must have a non-empty key before Mosaicast can derive identifiers. Set `MOSAICAST_SESSION_CHANNEL_KEY` when the session-channel secret must be distinct from the application encryption key:

```dotenv
MOSAICAST_SESSION_CHANNEL_KEY=your-long-random-secret
```

Publish the package configuration to customize the guard name or channel prefix:

```bash
php artisan vendor:publish --tag=mosaicast-config
```

```php
return [
    'broadcasting' => [
        'guard' => 'mosaicast-session',
        'session_channel_key' => env('MOSAICAST_SESSION_CHANNEL_KEY', env('APP_KEY')),
        'session_channel_prefix' => 'mosaicast.sessions',
    ],
];
```

Mosaicast registers its guard automatically. Do not use this guard for application authorization: it represents only a valid browser session and has no application user or permissions.

When changing `session_channel_prefix`, set the Vue plugin's `channelPrefix` option to the same value. The browser uses `mosaicast.sessions` by default.

## Session lifecycle

The channel identity changes when Laravel rotates the session ID, such as after login or logout. It also changes if the session-channel key changes. Mosaicast uses the current session ID when dispatching or finalizing the response. Inertia includes the identifier even on partial reloads that omit the event prop; the Vue plugin switches channels on the resulting navigation and leaves the old channel when a later page has no session. A queued job targeting an expired or rotated session cannot deliver to the browser's new channel and should be treated as best-effort delivery.

Outside a request, pass only an identifier captured with `Mosaicast::currentSessionIdentifier()` to `Mosaicast::toSession()`. The method rejects arbitrary values rather than allowing server code to emit to malformed channel names.

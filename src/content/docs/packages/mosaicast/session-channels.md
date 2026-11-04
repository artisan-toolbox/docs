---
title: Session broadcast channels
description: Authorize a private Mosaicast channel from a Laravel session without requiring a signed-in user.
---

Mosaicast registers a private broadcast channel for each Laravel session. The channel is available to guests as well as signed-in users; authorization checks the current Laravel session, including for visitors who have never signed in.

## Enable broadcasting in the host application

Mosaicast uses Laravel's configured broadcaster. To use Reverb, run `php artisan install:broadcasting`, configure the broadcast connection, and start the Reverb server in the target environment. Laravel's [broadcasting guide](https://laravel.com/framework/docs/13.x/broadcasting) covers installation, the authentication route, and Reverb's client configuration.

Keep the broadcast authentication endpoint on middleware that can read the same Laravel session cookie as the Inertia pages. Laravel normally exposes `/broadcasting/auth` when broadcasting is installed; if that route is absent, register the application's channel routes using Laravel's normal broadcasting setup. Mosaicast registers its own channel rule automatically, including when Laravel caches HTTP routes, so the host application does not need to duplicate it in `routes/channels.php`.

## Channel identity

Mosaicast derives an opaque session identifier with HMAC-SHA-256:

```text
HMAC-SHA-256(session ID + NUL + session CSRF token, session channel key)
```

Mosaicast sends only the derived identifier. It reads the ID and CSRF token from the session that Laravel already loaded. By default, the private channel name is:

```text
private-mosaicast.sessions.{session-identifier}
```

Laravel adds the `private-` prefix to its wire-level channel name. Pass `mosaicast.sessions.{identifier}` without that prefix to Echo's `private()` method. The Vue plugin does this using the identifier received in Inertia props.

The opaque identifier is a lowercase, 64-character SHA-256 HMAC. Private-channel authorization still requires the matching session cookie. A queued job may carry the identifier to address a specific session. Keep it out of URLs, logs, and long-term storage.

## Authorization requirements

Mosaicast registers the channel authorization rule and the `mosaicast-session` guard automatically. The guard identifies the current session through its HMAC identifier; the channel rule admits only an identifier that matches it. This works for guests and signed-in users, but it does not grant any application permissions.

Use the same Echo/Reverb connection and authorization endpoint as other private channels in the application. A subscription to `mosaicast.sessions.{identifier}` requires the matching session ID and CSRF token in the current Laravel session. Guest sessions receive a token from Laravel when they start.

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

The channel changes when Laravel rotates the session ID or CSRF token, or when the application rotates the channel key. Inertia sends the current identifier even on partial reloads that omit events. The Vue plugin switches to the new channel or leaves the old one when the response has no session identity.

Use a server-backed session driver such as database or Redis when logout must revoke new subscriptions. After Laravel invalidates or expires the stored session, presenting the old cookie can start a new guest session, but its new CSRF token cannot authorize the old channel. A rotation that leaves the old session record intact does not revoke that record. The cookie session driver cannot revoke replay of an earlier, still-valid cookie containing the session data.

Invalidating a Laravel session does not disconnect WebSocket subscriptions that the broadcaster already accepted. Jobs that send sensitive data must recheck application authorization before publishing, especially if they captured the target before logout. The Mosaicast guard identifies a browser session and cannot grant access to application data.

Mosaicast 1.2 replaces the ID-only channel identifiers used by earlier releases. Before deploying the upgrade, drain or discard queued notifications that target the old identifiers. After deploying, reload open clients so they subscribe to the new channels.

Outside a request, pass only an identifier captured with `Mosaicast::currentSessionIdentifier()` to `Mosaicast::toSession()`. The method rejects arbitrary values rather than allowing server code to emit to malformed channel names.

---
title: Troubleshooting
description: Diagnose Axora connections, Redis delivery, sessions, reconnects, and TypeScript resolution.
sidebar:
  order: 6
---

Axora has a short delivery path: Laravel session, Redis publication, daemon subscription, and browser `EventSource`. Check those boundaries in that order rather than adding reconnect loops or new credentials.

## The client connects but no events arrive

### Compare the Redis channel

The most common cause is a Redis prefix mismatch. Laravel's Redis client prefixes the logical channel automatically, while the asynchronous daemon must calculate the effective channel itself.

Start the daemon and inspect its startup message:

```text
Starting Axora on 127.0.0.1:8087/connect using Redis channel [my-app-database-axora]
```

Verify:

- `AXORA_REDIS_CONNECTION` selects the intended Laravel Redis connection;
- `AXORA_REDIS_CHANNEL` contains the logical name, normally `axora`, without manually duplicating the Laravel prefix;
- `database.redis.options.prefix` and connection-specific prefix values match between web and daemon processes;
- configuration caches were rebuilt and the daemon restarted after environment changes.

### Compare Redis deployments

Laravel publishes with `redis.connection`; the daemon subscribes with `redis.uri`. They must reach the same Redis deployment.

Confirm the supported URI scheme, host, port, credentials, and database settings from the daemon's runtime environment. Do not assume a container's `127.0.0.1` means the same host as the web container.

### Confirm the target session

`axora()->send()` without `users` targets the session attached to the Laravel request that executed it. The listening browser must be using that same session cookie.

Common mismatches include:

- testing the publisher in an Artisan command, Tinker, or a queue worker without `users`;
- opening the page in another browser profile or private window;
- regenerating the Laravel session between connection and publication;
- sending to a user whose active session is absent from the database session table;
- publishing more than `server.pending_event_seconds` before the target browser connects;
- exhausting `server.pending_event_buffer_bytes`, which evicts the oldest pending event;
- restarting the daemon after publication, because its pending buffer is process-local.

Use the integer returned by `send()` as a first diagnostic. `0` means user lookup found no target sessions. A positive value means Axora published to that many session IDs; it does not prove a browser was connected.

### Confirm the event name

The browser must subscribe to exactly the name sent by Laravel:

```php
axora()->send('document.loaded', ['document' => 42]);
```

```ts
axora.on("document.loaded", ({ document }) => {
  console.log(document);
});
```

Named SSE events do not trigger a listener registered for another name. Event names are case-sensitive.

## The SSE request returns 401

HTTP `401` means the daemon could not extract a valid session ID from Laravel's encrypted cookie.

Check:

1. The page first passed through Laravel's `web` middleware and established a session.
2. The public SSE endpoint uses the same origin as the application.
3. Laravel's session cookie domain and path include the public endpoint.
4. HTTPS and the cookie's `Secure` setting agree.
5. The daemon uses the same `APP_KEY`, `APP_PREVIOUS_KEYS`, and `session.cookie` name as the web process.
6. The reverse proxy forwards the browser's `Cookie` header.

Axora does not provide an authentication route. Adding a token query parameter will not fix a missing Laravel session cookie.

## The SSE request returns 404

The request method or private daemon path does not match. Axora accepts only `GET` at `server.path`.

With defaults:

- the browser requests `GET /_axora/connect` from the application origin;
- Nginx proxies it to `GET /connect` on `127.0.0.1:8087`.

Check `AXORA_SERVER_PATH`, the Nginx `proxy_pass` target, and the browser client's `endpoint` together.

## The SSE request returns 503

The process reached `server.max_connections`. Axora includes `Retry-After`, and native `EventSource` retries automatically.

If the limit is reached unexpectedly:

- check whether the application initialized more than one Axora client;
- verify that custom code is not calling `createAxora()` per component;
- inspect whether old daemon processes are still receiving traffic;
- review file descriptor and reverse-proxy connection limits;
- scale daemon processes or raise the configured limit after measuring memory.

`initializeAxora()` is idempotent, and the exported `axora` instance should be shared across ordinary modules and Vue components.

## The browser reconnects approximately every minute

This is expected. Axora closes each stream after 55 seconds by default so native `EventSource` reconnects before a 60-second infrastructure timeout.

Do not call `initializeAxora()` again from an `error` handler and do not create a custom retry interval. The browser already reconnects the existing `EventSource`, and the Axora client preserves its listener registry.

If reconnects happen much sooner than `server.max_connection_seconds`, inspect proxy buffering, read timeouts, network failures, and daemon logs.

## Events arrive late or in bursts

SSE is being buffered between the daemon and browser. Disable reverse-proxy buffering, caching, compression, and response transformations for the Axora location.

For Nginx, confirm at least:

```nginx
proxy_buffering off;
proxy_cache off;
gzip off;
```

Axora sends `X-Accel-Buffering: no`, but the proxy configuration must still allow streaming.

## A slow browser is disconnected

This is intentional backpressure protection. Every connection has a bounded output buffer. If queued frames exceed `server.connection_buffer_bytes`, Axora closes that stream rather than letting one browser grow daemon memory indefinitely.

Native `EventSource` reconnects. An event that found no live recipient may still be delivered from the short pending buffer, but this is not guaranteed after expiry, capacity eviction, or a restart. Reduce event frequency or payload size before increasing either buffer.

## An event sent just before connection is still missing

The default grace window is 10 seconds. Confirm `AXORA_PENDING_EVENT_SECONDS` is not `0`, the event fits within `AXORA_PENDING_EVENT_BUFFER_BYTES`, and the daemon remained running between publication and connection. The server delivers pending events only to the matching Laravel session ID, so also compare the publisher request session with the cookie on the SSE request.

In a multi-daemon deployment, pending copies are process-local. A healthy reconnect can land on any daemon because every daemon receives each live Redis publication. Redis does not replay publications missed while a daemon itself was offline.

## User delivery from a job returns zero

With the default resolver, verify:

- `SESSION_DRIVER=database`;
- the configured session table has Laravel's standard `id`, `user_id`, and `last_activity` columns;
- the user is authenticated in an active browser session;
- `last_activity` is newer than the `session.lifetime` cutoff;
- the job and web application use the same session database.

For another indexed store, register `Axora::resolveSessionsUsing()` and confirm it returns non-empty session ID strings. Empty and duplicate results are normalized; invalid values throw a `LogicException`.

## TypeScript imports work in Vite but autocomplete is missing

A Vite alias only teaches Vite how to bundle the import. IDEs and TypeScript do not reliably read Vite configuration.

Prefer the local package dependency:

```json
"@artisan-toolbox/axora": "file:vendor/artisan-toolbox/axora"
```

Then run `npm install`. If the application intentionally uses a Vite alias, add matching `paths` entries to `tsconfig.json` as shown in [Browser client](./browser-client/#vite-alias-alternative).

For event-specific autocomplete, ensure the `AxoraEvents` module augmentation file is inside the application's TypeScript include paths and imports `@artisan-toolbox/axora` before declaring the module.

## Useful diagnostics

- `php artisan axora:start` shows the private endpoint and effective Redis channel.
- Browser developer tools show the SSE request status, request cookie, response headers, reconnects, and received event frames.
- Laravel logs capture publication exceptions such as invalid JSON or oversized events.
- Daemon logs report Redis subscription loss and malformed or oversized Redis messages without including their raw payloads.

If the connection is healthy, the channel and Redis deployment match, and the session ID is correct, reduce the test to one `toast` event and one listener before reintroducing application-specific abstractions.

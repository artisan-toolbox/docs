---
title: Axora
description: Deliver named JSON events to Laravel browser sessions over Server-Sent Events.
sidebar:
  badge: 0.x
  order: 1
---

Axora delivers transient, named events from Laravel to browser sessions over [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events). It is designed for UI signals such as toasts, progress updates, and notifications that tell the browser to refresh durable application state.

```php
axora()->send('toast', [
    'type' => 'success',
    'message' => 'The document was saved.',
]);
```

```ts
import { axora, initializeAxora } from "@artisan-toolbox/axora";

axora.on("toast", ({ type, message }) => {
  showToast(type, message);
});

initializeAxora();
```

The browser holds one native `EventSource` connection. A standalone asynchronous PHP daemon owns that connection, while ordinary Laravel requests publish through Redis and return immediately. Axora never keeps a PHP-FPM worker occupied by a browser stream.

## Deliberately small architecture

An Axora event contains only:

- a validated event name such as `toast` or `document.loaded`;
- a JSON-serializable payload;
- the Laravel session ID that should receive it.

The complete path is:

1. A normal Laravel page establishes its encrypted session cookie.
2. The browser connects to the proxied Axora endpoint with that cookie.
3. The daemon decrypts the cookie and indexes the connection by session ID.
4. `axora()->send()` publishes the event to Redis.
5. Every Axora daemon receives the publication. A daemon writes it to its connected target session or briefly retains it when no local recipient exists.

There is no separate Axora token, authentication route, WebSocket protocol, durable queue, or FPM streaming route. The daemon does not load the Laravel session store for browser connections.

## Requirements

- PHP 8.5 or later
- Laravel 13
- Redis reachable by both Laravel and the Axora daemon
- A long-running process supervisor for `php artisan axora:start`
- A same-origin reverse proxy from `/_axora/connect` to the private daemon
- A browser with native `EventSource` support

Vue 3.5 or later is optional and required only for the `@artisan-toolbox/axora/vue` composable.

## Install

Install the Composer package:

```bash
composer require artisan-toolbox/axora
```

Register the Composer-installed frontend client as a local dependency in the application's `package.json`:

```json
{
  "dependencies": {
    "@artisan-toolbox/axora": "file:vendor/artisan-toolbox/axora"
  }
}
```

Install frontend dependencies after Composer has populated `vendor`:

```bash
npm install
```

Finally, proxy the public SSE endpoint and run the daemon:

```bash
php artisan axora:start
```

Continue with:

- [Laravel usage](./usage/) for sending to the current session or users;
- [Browser client](./browser-client/) for TypeScript, autocomplete, and Vue;
- [Configuration](./configuration/) for every environment option;
- [Server and deployment](./server-and-deployment/) for Nginx and process supervisors;
- [Troubleshooting](./troubleshooting/) when a connection opens but events do not arrive.

## Delivery guarantees

Axora uses Redis Pub/Sub and native SSE, so delivery is intentionally ephemeral:

- each daemon keeps an event with no local recipient in a bounded, process-local buffer for 10 seconds by default;
- the first matching connection consumes that pending copy;
- an event is lost after its window expires, when the oldest entry is evicted for capacity, or when the daemon restarts;
- `send()` reports target sessions published to Redis, not browser acknowledgements;
- Redis does not persist or replay Axora events.

This small grace window covers the common race where `send()` runs milliseconds before the browser opens its stream. It is not a durable delivery guarantee. In a multi-daemon deployment, more than one process may briefly retain the same publication; the official browser client suppresses recently repeated event identifiers during its lifetime.

Keep authoritative state in the database, object storage, queues, or another durable system. Use Axora as the small real-time nudge that tells the UI something changed.

## Stability

Axora is pre-release software. Its API may change before 1.0. Review the [changelog](https://github.com/artisan-toolbox/axora/blob/main/CHANGELOG.md) when upgrading.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/axora)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/axora)

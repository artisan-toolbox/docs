---
title: Mosaicast
description: Deliver Laravel events through Inertia props or private session broadcasting.
---

Mosaicast gives Laravel, Inertia, and Vue applications one event contract across HTTP responses and private broadcasting. A request can deliver an event in its Inertia response; a job or a response without the event prop broadcasts to the browser session instead.

This guide covers Mosaicast 1.2. When upgrading from 1.1, review the [dispatcher, frontend, and session changes](#dispatcher-class).

## Requirements

- PHP 8.5 or later within the PHP 8.x series
- Laravel 13 components
- Inertia Laravel 3.x, installed through Core
- A Laravel web request with an active session for implicit dispatch
- Laravel broadcasting configured for the broadcast path; Reverb is one supported driver
- Node.js 20 or later, Vue 3, and `@inertiajs/vue3` 3.x for the JavaScript client

## Installation

```bash
composer require artisan-toolbox/mosaicast:^1.2
```

Laravel discovers the package service provider automatically. Keep Laravel's session middleware on routes that call `Mosaicast::dispatch()`. For private broadcasts, enable the [broadcast authentication route](./session-channels/). Install and register the [Vue plugin](./vue-plugin/) to receive events in the browser.

## First event

```php
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;

Mosaicast::dispatch('orders.updated', ['orderId' => $order->id]);
```

The global `mosaicast()` helper dispatches with the same event and payload arguments:

```php
mosaicast('orders.updated', ['orderId' => $order->id]);
```

An Inertia response that resolves the shared `mosaicast` prop includes this event under `mosaicast.events`. On another response, Mosaicast broadcasts it to the current session's private channel. The [Vue plugin](./vue-plugin/) delivers both paths to the same listener:

```ts
import { mosaicast } from "@artisan-toolbox/mosaicast";

const stop = mosaicast().on("orders.updated", (payload, source) => {
  console.log(payload.orderId, source); // source: 'inertia' or 'broadcast'
});
```

## Delivery sequence

1. Call `Mosaicast::dispatch()` in a request.
2. If Inertia resolves `mosaicast`, the event appears in `mosaicast.events`.
3. Otherwise, Mosaicast broadcasts to the current session's private channel after Laravel builds the response and before it returns it.
4. In a job, capture `Mosaicast::currentSessionIdentifier()` in the request and call `Mosaicast::toSession($identifier)` or `mosaicast()->toSession($identifier)` in the job.

The shared `mosaicastSessionIdentifier` prop is included in every Inertia response, including partial reloads that omit events. It lets the client keep its private channel current without consuming events that need the broadcast fallback.

## Detailed guides

- [Session broadcast channels](./session-channels/): private, session-scoped channel authorization for guests and signed-in users.
- [Inertia delivery](./inertia-delivery/): dispatch strings and Laravel event objects, with lazy shared props and a private broadcast fallback.
- [Vue plugin](./vue-plugin/): connect Laravel Echo and receive either delivery path through one listener API.
- [Delivery guarantees](./roadmap/): the public delivery contract and its realtime constraints.

## Versioning

Mosaicast is maintained on the `1.x` branch. GitHub Actions runs tests for pushes to version branches and for pull requests. Review the [changelog](https://github.com/artisan-toolbox/mosaicast/blob/1.x/CHANGELOG.md) before upgrading.

### Dispatcher class

Starting with 1.2, the facade and the `mosaicast()` helper use `ArtisanToolbox\Mosaicast\Delivery\MosaicastDispatcher`. Update any direct injection, helper return types, and container bindings that referenced `ArtisanToolbox\Mosaicast\Mosaicast`. The root class holds the package version and README configuration for Maintainer.

For the same upgrade, switch CommonJS consumers to ES module imports and refresh the Composer-delivered JavaScript dependency. The channel identifier now includes the session's CSRF token. Reload open clients, drain jobs that target old identifiers, and pass the session token if you call `SessionBroadcastChannel::identifier()` or `name()` directly. See the [session lifecycle](./session-channels/#session-lifecycle) for details.

### README header

Maintainer generates the README header from `ArtisanToolbox\Mosaicast\Mosaicast::readmeHead()` during releases. To regenerate it locally, install Composer development dependencies and run this command from the package checkout.

```bash
php vendor/bin/maintainer readme:update
```

Edit the release class to change the header. Maintainer replaces the marked block and preserves the rest of the README.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/mosaicast)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/mosaicast)

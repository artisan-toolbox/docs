---
title: Mosaicast
description: Deliver Laravel events through Inertia props or private session broadcasting.
sidebar:
  badge: 1.x
  order: 5
---

Mosaicast gives Laravel, Inertia, and Vue applications one event contract across HTTP responses and private broadcasting. A request can deliver an event in its Inertia response; a job or a response without the event prop broadcasts to the browser session instead.

Its delivery strategy is:

- An Inertia response that resolves the `mosaicast` prop receives events immediately, without waiting for a realtime connection.
- A redirect, download, JSON response, partial reload that omits the prop, deferred callback after the response, or background job delivers through Laravel broadcasting instead.
- Every broadcast is private and scoped to one browser session, including for guests.

## Requirements

- PHP 8.5 or later
- Laravel 13 components
- A Laravel web request with an active session for implicit dispatch
- Laravel broadcasting configured for the broadcast path; Reverb is one supported driver
- Vue 3 and `@inertiajs/vue3` 3.x when using the JavaScript client

## Installation

```bash
composer require artisan-toolbox/mosaicast
```

Laravel discovers the package service provider automatically. No Mosaicast-specific middleware is needed. Keep Laravel's ordinary session middleware on routes that call `Mosaicast::dispatch()`, and enable your application's broadcasting authentication route for the private channel. See [session broadcast channels](./session-channels/) for the guard and cookie requirements.

## Versioning

Mosaicast is maintained on the 1.x line and follows semantic versioning. Its public delivery, event, channel, and Vue listener APIs are documented in this guide and its linked references. Review the [changelog](https://github.com/artisan-toolbox/mosaicast/blob/main/CHANGELOG.md) before upgrading.

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
3. Otherwise, Mosaicast broadcasts to the current session's private channel after the response is handled.
4. In a job, capture `Mosaicast::currentSessionIdentifier()` in the request and call `Mosaicast::toSession($identifier)` or `mosaicast()->toSession($identifier)` in the job.

The shared `mosaicastSessionIdentifier` prop is included in every Inertia response, including partial reloads that omit events. It lets the client keep its private channel current without consuming events that need the broadcast fallback.

## Detailed guides

- [Session broadcast channels](./session-channels/): private, session-scoped channel authorization for guests and signed-in users.
- [Inertia delivery](./inertia-delivery/): dispatch strings and Laravel event objects, with lazy shared props and a private broadcast fallback.
- [Vue plugin](./vue-plugin/): connect Laravel Echo and receive either delivery path through one listener API.
- [Delivery guarantees](./roadmap/): the public delivery contract and its realtime constraints.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/mosaicast)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/mosaicast)

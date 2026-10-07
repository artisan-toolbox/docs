---
title: Inertia delivery
description: Deliver Mosaicast events through Inertia shared props with broadcast fallback.
---

Mosaicast collects events during a web request. When an Inertia response resolves the `mosaicast` shared prop, it takes the events accumulated so far and delivers them in `mosaicast.events`. Any events still pending when Laravel handles the response are sent to the current session's private broadcast channel. The choice depends on actual prop resolution, not the request's `X-Inertia` header or whether the navigation used AJAX.

## Request requirements

No Mosaicast-specific middleware needs to be registered. Routes that use implicit `Mosaicast::dispatch()` still need Laravel's normal session middleware, such as the `web` group. Mosaicast reads the current session when used and listens to Laravel's `RequestHandled` event to broadcast pending events. Without an active session, implicit dispatch throws a `LogicException`; use an explicit `toSession()` target outside a request.

The package registers the `mosaicast` Inertia shared prop automatically when `inertiajs/inertia-laravel` is installed. Its payload has this shape:

```php
[
    'sessionIdentifier' => '9c9206cc5d38f284d87ca2cb6ad30b6c63a948b9960773742634793ed99f2681',
    'events' => [
        [
            'name' => 'orders.updated',
            'payload' => [
                'orderId' => 123,
            ],
        ],
    ],
]
```

The `events` array preserves dispatch order. Resolving the prop consumes only the events already queued; an event dispatched later in the same request remains pending for broadcast fallback.

The package also shares a top-level `mosaicastSessionIdentifier` prop through Inertia's `always()` behavior. It contains the same opaque identifier, or `null` when no session is available. It is included in partial Inertia responses even when `mosaicast` is omitted, so the Vue client can keep its private-channel subscription in sync without consuming queued events.

`sessionIdentifier` is an HMAC-derived identifier, not the Laravel session ID. It is a lowercase 64-character SHA-256 HMAC. Private-channel authorization still requires the matching session cookie. `toSession()` accepts only that format, preventing malformed channel names.

## Dispatch an event

Use the facade while the web request is active:

```php
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;

Mosaicast::dispatch('orders.updated', [
    'orderId' => $order->id,
]);
```

The `mosaicast()` helper provides the equivalent concise form:

```php
mosaicast('orders.updated', ['orderId' => $order->id]);
```

The event name is the client-side contract. Use stable, application-specific names. The [Vue listener API](../vue-plugin/) receives either delivery path through `mosaicast().on()`.
String dispatch accepts an associative payload array. An empty event name is rejected. Event objects define their own payload and cannot receive a separate payload argument.

## Laravel event objects

Mosaicast also accepts event objects and mirrors Laravel broadcasting conventions. Without custom methods, the event's class name becomes the event name and only its public properties become the payload. Private and protected properties are never exposed; Laravel transport properties such as `socket` and `broadcastQueue` are excluded.

```php
final readonly class OrderUpdated
{
    public function __construct(public int $orderId) {}
}

Mosaicast::dispatch(new OrderUpdated($order->id));
```

The client receives the name `App\Events\OrderUpdated` when that is the event's class. Define Laravel's existing broadcast methods to customize the contract:

```php
final readonly class OrderUpdated
{
    public function __construct(private int $orderId) {}

    public function broadcastAs(): string
    {
        return 'orders.updated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return ['orderId' => $this->orderId];
    }
}
```

`broadcastAs()` and `broadcastWith()` are applied consistently whether Mosaicast delivers through shared props or Laravel broadcasting. Transport metadata such as Laravel's internal `socket` value is not included in the client event payload. A string-backed enum returned by `broadcastAs()` contributes its string value as the event name.

Only public event properties are selected by default, but a public property can itself contain sensitive data. Laravel `Arrayable` values, including Eloquent models, are converted to arrays. Prefer `broadcastWith()` to expose a deliberate, minimal payload rather than passing a full model when privacy matters. Mosaicast does not infer which model attributes are safe for a browser.

Use the optional trait when the event should construct and dispatch itself:

```php
use ArtisanToolbox\Mosaicast\Concerns\DispatchesMosaicast;

final readonly class OrderUpdated
{
    use DispatchesMosaicast;

    public function __construct(public int $orderId) {}
}

OrderUpdated::mosaicast($order->id);
```

`AbstractMosaicastEvent` is available as an alternative base class when the event can extend it.

## Delivery behavior

| Final response                                          | Delivery                                                                                        |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Inertia response with `mosaicast` resolved              | `mosaicast.events` shared prop                                                                  |
| Partial reload that omits `mosaicast`                   | Private session broadcast channel; the identifier still arrives in `mosaicastSessionIdentifier` |
| Redirect, download, JSON, or other non-Inertia response | Private session broadcast channel                                                               |

## Background jobs and deferred work

Capture the opaque session target while a request is active, then pass it to a job or deferred callback. Explicit targets always use Laravel broadcasting.

```php
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;

$sessionIdentifier = Mosaicast::currentSessionIdentifier();

dispatch(new ProcessOrder($sessionIdentifier, $order->id));
```

The queued job stores that identifier instead of relying on a request that no longer exists:

```php
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;
use Illuminate\Contracts\Queue\ShouldQueue;

final class ProcessOrder implements ShouldQueue
{
    public function __construct(
        public readonly string $sessionIdentifier,
        public readonly int $orderId,
    ) {}

    public function handle(): void
    {
        mosaicast()->toSession($this->sessionIdentifier)->dispatch('orders.updated', [
            'orderId' => $this->orderId,
        ]);
    }
}
```

A job has no implicit current request; `Mosaicast::dispatch()` alone cannot determine which browser session should receive its event. An explicit target always broadcasts. `Mosaicast::currentTarget()` is also available when server code needs the `SessionDeliveryTarget` value object; its `sessionIdentifier` property is the string accepted by `toSession()`.

An event emitted with `Mosaicast::dispatch()` after Laravel has handled the current response, such as from `defer()`, is broadcast immediately to that request's session target. If Laravel regenerates the session ID during a request, subsequent dispatches, the resolved shared prop, and the final broadcast fallback use the regenerated session identifier. Jobs must capture the target after regeneration when they should address the new browser session.

Broadcasting does not replay an event to a channel subscribed after the event was sent. If a partial reload both rotates the session and omits `mosaicast`, an event broadcast at the end of that request may arrive before the Vue client can subscribe to the new channel. Include `mosaicast` in such a response when immediate delivery matters, or avoid rotating the session during that partial reload.

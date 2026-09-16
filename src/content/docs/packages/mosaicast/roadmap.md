---
title: Delivery guarantees
description: The Mosaicast delivery contract and the realtime constraints applications should account for.
---

Mosaicast 1.x provides an event-delivery contract through its PHP facade, Inertia shared props, private session channel, explicit job target, and Vue listener plugin. The [Inertia delivery](../inertia-delivery/), [session channel](../session-channels/), and [Vue plugin](../vue-plugin/) guides describe each part of that contract.

## Implemented contract

- `Mosaicast::dispatch('name', $payload)` and `Mosaicast::dispatch(new Event(...))` accept a name and associative payload or a Laravel event object. Event objects follow `broadcastAs()`, `broadcastWith()`, and public-property conventions.
- Events queued in a request are consumed when Inertia actually resolves `mosaicast.events`. Remaining events are broadcast after Laravel handles the response. A later dispatch, including one in `defer()`, broadcasts immediately after that point.
- Broadcasts use a private channel derived from the current Laravel session. Jobs must capture an opaque session identifier in a request and pass it to `Mosaicast::toSession($identifier)`.
- The Vue client listens to Inertia navigation and the application's Echo instance. `mosaicast().on()` returns an unsubscribe function; callbacks receive the payload and `"inertia"` or `"broadcast"` as the source.
- `mosaicastSessionIdentifier` is an always-included Inertia prop, so partial reloads can update the private-channel subscription without consuming events omitted from `mosaicast.events`.

## Delivery limits

Broadcasting is best effort and does not replay an event to a client that joins after it was sent. A request that both rotates its session and omits `mosaicast.events` from a partial response can broadcast before the client subscribes to the new channel. Include the event prop in that response when immediate delivery matters.

A queued job targeting an expired or rotated session may publish to a channel the browser no longer uses. Neither the opaque identifier nor the session guard provides application authorization; the host app remains responsible for deciding which data the event may reveal.

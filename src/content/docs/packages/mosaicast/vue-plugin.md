---
title: Vue plugin
description: Connect a Vue and Inertia application to the private Mosaicast session channel.
---

The Mosaicast Vue plugin delivers Inertia prop events and private broadcasts through the same `mosaicast().on()` API. The callback receives the event payload and its source (`"inertia"` or `"broadcast"`). Diagnostics are disabled by default.

## Install from the Composer package

Install the Composer package before the JavaScript dependency so `vendor/artisan-toolbox/mosaicast` exists. Add the JavaScript package from that vendor directory:

```json
{
  "devDependencies": {
    "@artisan-toolbox/mosaicast": "file:vendor/artisan-toolbox/mosaicast"
  }
}
```

To receive private broadcasts, install and configure Laravel Echo in the host application. Reverb uses the Pusher protocol, so `pusher-js` belongs in the host application:

```bash
npm install --save-dev @laravel/echo-vue laravel-echo pusher-js
```

Composer ships the compiled client and TypeScript declarations in `dist/`. The application imports that build as an ES module. Use Node.js 20 or later, Vue 3, and `@inertiajs/vue3` 3.x. Run `npm install` again after replacing or rebuilding the vendor package so the application uses the updated `dist` files.

## Register the plugin

Configure `@laravel/echo-vue` before registering Mosaicast, then pass its configured Echo instance to the plugin. Use the Reverb variables and connection settings from your application. Laravel's [broadcasting guide](https://laravel.com/framework/docs/13.x/broadcasting#client-side-installation) has the client configuration reference.

```ts
import { configureEcho, echo } from "@laravel/echo-vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { createMosaicast } from "@artisan-toolbox/mosaicast";

configureEcho({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
});

void createInertiaApp({
  // Keep the application's existing page resolution and other options here.
  withApp(app, { ssr }) {
    if (!ssr) {
      app.use(
        createMosaicast({
          echo: echo<"reverb">(),
          debug: import.meta.env.DEV,
        }),
      );
    }
  },
});
```

The plugin delivers events from the initial page and fresh Inertia responses, including reloads that replace the current page. It uses `mosaicastHasEvents` to distinguish new events from props retained across partial reloads. Restoring a page from browser history does not replay events or restore an old subscription. If back or forward navigation loads a fresh document, the plugin can deliver its new events and subscribe to its current session.

The always-included `mosaicastSessionIdentifier` prop updates the subscription even when a partial response omits `mosaicast.events`. A fresh response with a null identifier leaves the previous channel. An empty payload reaches listeners as an empty object. A malformed event is skipped without preventing delivery of valid events in the same response. Set `debug: true` to log subscription, delivery, and validation diagnostics.

If the backend's `mosaicast.broadcasting.session_channel_prefix` configuration differs from the default `mosaicast.sessions`, pass the same value to the plugin:

```ts
app.use(
  createMosaicast({
    echo: echo<"reverb">(),
    channelPrefix: "custom.sessions",
  }),
);
```

The prefix is a deployment setting shared by Laravel and the Vue application. A mismatch prevents Echo from authenticating the intended channel.

The plugin options are:

| Option          | Purpose                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `echo`          | The host application's configured Echo instance. Inertia events still work without it, but private broadcasts cannot be received. |
| `channelPrefix` | The backend's session-channel prefix. Defaults to `mosaicast.sessions`.                                                           |
| `debug`         | Enables subscription, event, and validation logs. Defaults to `false`.                                                            |
| `logger`        | Replaces `console` for diagnostics when `debug` is enabled; it must provide `info()` and `error()`.                               |

## Verify both delivery paths

Dispatch an event from a route that renders an Inertia page and inspect the page's `mosaicast.events` prop. The listener should receive `source === "inertia"`; the client does not need to finish its WebSocket subscription before handling that response.

Then dispatch from a job or a response that does not resolve `mosaicast`. A browser already subscribed to the matching private channel receives `source === "broadcast"`. Laravel broadcasting does not replay earlier messages. The [delivery guide](../inertia-delivery/#delivery-behavior) covers synchronous broadcaster errors and [session rotation](../inertia-delivery/#background-jobs-and-deferred-work).

When nothing arrives, check the path in order: the server produced the intended event and payload, `mosaicastSessionIdentifier` is present, the host application's Echo instance was passed to the plugin, `/broadcasting/auth` received the session cookie and accepted the channel, and the host broadcaster is connected to Reverb. If no authorization request appears, the plugin has not attempted a private subscription. Enable `debug` only in an environment where logging event payloads is acceptable.

## Listen for events

Use `mosaicast()` anywhere in the client application after importing it from the package. `on()` returns an unsubscribe callback, and `off()` removes a specific listener.

```ts
import { mosaicast } from "@artisan-toolbox/mosaicast";

const stop = mosaicast().on("orders.updated", (payload, source) => {
  console.log(payload.orderId);
  console.log(source); // "inertia" or "broadcast"
});

// Later, for example when a component is unmounted:
stop();
```

Register component listeners during component setup and call the returned function on unmount. The plugin itself registers navigation and Echo subscriptions during installation; Vue lifecycle hooks such as `onMounted()` belong inside components or composables.

Laravel Echo-style leading dots are accepted too:

```ts
const onOrderUpdated = (
  payload: Record<string, unknown>,
  source: "inertia" | "broadcast",
) => {
  console.log(payload, source);
};

mosaicast().on(".orders.updated", onOrderUpdated);
mosaicast().off("orders.updated", onOrderUpdated);
```

The event name is identical for shared-prop and broadcast delivery. A Laravel event object without `broadcastAs()` uses its class name, such as `App\Events\OrderUpdated`; register its short class name (`OrderUpdated`) when the class is in the default `App\Events` namespace. For events in other namespaces, register the full class name to avoid matching another event with the same short class name. A `broadcastAs()` method uses its returned value.

## Diagnostic output

With `debug: true`, the plugin logs:

```text
[Mosaicast] Session identifier: 8b1f…
[Mosaicast] Subscribing to private channel: mosaicast.sessions.8b1f…
[Mosaicast] Private channel subscribed: mosaicast.sessions.8b1f…
[Mosaicast] Inertia event: { ... }
[Mosaicast] Broadcast event: { ... }
```

If the Echo instance is not provided or the private-channel authorization fails, the plugin logs the reason as an error.

Diagnostics include event payloads. Enable `debug` only where console output may safely contain the event's application data.

Do not log, persist, or expose the raw Laravel session ID. Mosaicast only uses its HMAC-derived identifier.

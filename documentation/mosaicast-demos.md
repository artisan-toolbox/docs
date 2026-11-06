# Mosaicast delivery demonstrations

The Inertia delivery guide contains three working response examples and an optional queued completion example. The demonstrations illustrate delivery contracts. Their counts do not measure throughput or latency.

## Ownership and public APIs

Vue components, transport helpers, and their tests live under `resources/js/components/demo/mosaicast/inertia-delivery/`. Backend actions, validation, event objects, and the job live under `app/Demo/Mosaicast/InertiaDelivery/`. `routes/demo.php` registers their web endpoints.

`DemoFrame` owns the resizable container and source display. Its source panels import the actual application files as text. `DemoAction` wraps the public Front Awesome `Button` component. The Mosaicast examples and the existing branding preview consume that wrapper.

`resources/js/app.ts` installs the public `createMosaicast()` plugin once. It uses the channel prefix shared by the backend. Components use the public `mosaicast().on()` API and remove their listeners after a response, reset, failure, or unmount. The backend uses `Mosaicast::dispatch()`, `currentSessionIdentifier()`, and `toSession()->dispatch()`.

Application-specific code validates the allowed scenarios, limits submitted messages, matches an event to its active demonstration run, and renders results. Mosaicast owns event delivery and session-channel authorization. No application code copies package delivery logic or calls its internal event emitter.

## Response comparisons

Each start action sends one session-backed Inertia POST with a UUID, a message of at most 120 characters, and an allowed scenario. The backend defines the event names and order ID. Both paths use the same envelope list, count, session, timing, and response. Neither introduces an artificial delay.

| Scenario | Event names                                                                   | Expected Mosaicast result                                                                |
| -------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| String   | `demo.orders.updated`                                                         | One listener delivery with source `inertia`.                                             |
| Object   | `demo.orders.object-updated`                                                  | One listener delivery using the object's `broadcastAs()` and `broadcastWith()` contract. |
| Multiple | `demo.orders.accepted`, `demo.reports.prepared`, `demo.notifications.created` | Three listener deliveries in sequence order 1, 2, and 3.                                 |

The controller also dispatches the corresponding native Laravel event. The event object does not implement `ShouldBroadcast`. Native dispatch therefore executes server-side listeners without automatically delivering a browser event. The controller explicitly places identical envelopes in `demoResult.manualEvents` to demonstrate an ordinary Inertia response bridge. That column is labeled as a manual prop rather than a native browser event.

The Mosaicast column changes only through package listener callbacks. A partial visit requests `mosaicast` and `demoResult`, preserves component state, and preserves the documentation URL. Each example registers listeners before sending the visit and stops listening when it finishes. Reset clears the example's display and does not send another request.

## Queued completion prerequisites

The queued example requires an authenticated user with a verified `atb.dev.br` staff email, a Redis queue connection, a running Horizon worker consuming `demos` on the documentation server, and the external WSS Software Reverb application. That Reverb application does not run Horizon for the documentation. Backend configuration requires the application ID, key, secret, and host; browser configuration uses only public connection settings. These checks are separate. Configuration presence does not establish that a worker or Reverb service is running. Follow [queue operation](queues.md) for environment and process ownership.

The host's ordinary Echo instance is application infrastructure. It is created once when `VITE_REVERB_APP_KEY` and `VITE_REVERB_HOST` are present and passed directly to the Mosaicast plugin. It uses `VITE_REVERB_PORT` and `VITE_REVERB_SCHEME` for its connection. Standard Echo connects during application startup. It does not provide a deferred-connection option. No demonstration job or request starts automatically, and the application does not create a second transport or lazy adapter for a demonstration.

Clicking **Queue one job** registers the completion listener and waits up to ten seconds for the session's actual private-channel subscription. The helper uses Echo's Pusher channel object and the public subscription state and callbacks. It removes its temporary subscription callbacks after success or failure. Leaving the page while connecting prevents the job submission.

The request captures `Mosaicast::currentSessionIdentifier()` on the server and submits one `CompleteDemo` job to the Redis `demos` queue. The request accepts neither a session target nor a channel name from the browser. The job has one attempt and a fifteen-second timeout. It sends one bounded payload with `Mosaicast::toSession($identifier)->dispatch('demo.jobs.completed', $payload)`.

The response marks the job as queued. The display marks completion only when its matching public listener receives the actual broadcast. A fast worker can deliver that event before the response finishes; neither order is guaranteed. Late request callbacks preserve an already received completion and cannot replace the state or listeners of a newer run. It reports a missing completion after twenty seconds without polling or resubmitting. The job may still be queued or running. Reset clears the display and does not cancel queued work. The demonstration never starts services or changes deployment credentials.

## Verification

Run commands from the documentation application root, after Composer and frontend dependencies are installed.

```bash
php artisan test --compact tests/Feature/MosaicastDemoTest.php
npm test -- resources/js/components/demo
npm run types:check
```

Feature tests exercise the real Mosaicast provider and response serialization, native event dispatch, ordered partial responses, server validation, staff authorization, and the queue job's captured session target. Queue and broadcast fakes isolate external infrastructure. The job test invokes its real handler and checks the resulting private broadcast envelope.

Frontend tests install the actual public Mosaicast plugin. They replace the Inertia visit and Echo network boundaries, then deliver response or broadcast inputs through the plugin's public integrations. They cover user-triggered actions, event counts and order, source labels, cancellation, reset, listener cleanup, private-subscription failures, and missing queued completions. They do not call the internal emitter.

The native Vite Plus test configuration clears the development Reverb key and host for component tests. A regression imports the real broadcast module with a guarded Echo constructor and confirms it does not create a connection. This prevents a developer's filled private environment from connecting the test suite to WSS; focused transport tests continue to use synthetic network boundaries.

In a browser, run each response example and verify counts of one, one, and three, source `inertia`, and an unchanged documentation URL. Change a message and verify the same value in both columns. Reset and navigate away to check lifecycle cleanup. With queue infrastructure already configured and a verified staff session, start the optional job and verify its matching Horizon entry and a listener delivery labeled `broadcast`. Record the actual timing without requiring delivery after the response, and check non-delivery in another independent session. Without those prerequisites, verify that the queue action remains unavailable and the response examples still work.

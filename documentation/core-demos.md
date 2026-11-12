# Maintain the Core conditional array demo

The Conditional Arrays guide contains a runnable example backed by the installed Core package. This guide explains how to change that example and verify its behavior.

## Run the example

Open the registered `core/conditional-arrays` guide after installing Composer dependencies and frontend dependencies and building the application. The demo needs the normal Laravel web application. It needs no queue worker, broadcaster, database record, printer, or sign-in session.

1. Select **Run example** with both options cleared.
2. Inspect the returned payload. Ordinary values such as `false`, `null`, `0`, and an empty string remain. The optional contact and middle list item are absent, and the contact closure has not executed.
3. Select the contact option and run again. The nested contact appears and the closure evaluation indicator changes.
4. Select the extra-item option and run again. The middle list entry appears.
5. Select **Reset**. The controls return to their initial values and the previous result disappears. Reset does not send a request.

Core preserves numeric keys. Removing the middle entry leaves keys `0` and `2`, so PHP encodes that sparse array as a JSON object. Including all entries produces a JSON array. The demo shows the actual server result without converting either shape. Apply `array_values()` in your own application when you explicitly need a reindexed JSON list.

Results describe the last submitted options. Changing a checkbox does not execute PHP or silently recompute the displayed result. All data is fictional and fixed in the demonstration source.

## Keep each responsibility in its owner

The example has one small request and response contract:

```text
Request:  includeContact, includeExtraItem
Response: options, payload, contactEvaluated
```

The two inputs are booleans. The endpoint accepts no executable code, class names, file paths, or user records. Its validated options select parts of a fixed example. The flags are demonstration inputs, not authorization decisions.

Backend code belongs under `app/Demo/Core/ConditionalArrays/`:

- `ConditionalArraysRequest` validates the input at the HTTP boundary.
- `ConditionalArraysController` runs the example through the namespaced `ArtisanToolbox\Core\sift_when()` helper and Laravel's registered `Arr::sift()` macro. It returns JSON with private, no-store caching.
- `routes/demo.php` registers the rate-limited named POST route `demo.core.conditional-arrays`. The existing web middleware supplies CSRF protection, and the shared indexing middleware applies noindex response headers.

The Vue component and its tests belong under `resources/js/components/demo/core/conditional-arrays/`. The documentation page composes the component; it does not run requests or own demo state. The component consumes the named route through Ziggy's existing JSON configuration. Keep `demo.core.*` in its narrow route filter.

Core supplies the helper and macros. Front Awesome supplies the public button consumed by `DemoAction`. The application already owns `DemoFrame` for resizing and source disclosure and `CodeExample` for highlighted output. Reuse those components. Do not copy Core's internal marker or sifter implementation into the application or reproduce the result in JavaScript.

The source disclosure imports the actual Vue and backend files with Vite's `?raw` import. Change the executed example rather than a separate demonstration snippet. Include only deliberately public demo code in these imports.

## Keep requests independent of navigation

This computation uses Inertia 3's native `useHttp()` helper with a JSON endpoint. It does not navigate or return a second documentation page response. The reader's URL, scroll position, canonical metadata, and browser history remain those of the guide.

Mosaicast's existing demonstrations use partial Inertia visits to demonstrate response delivery. That transport remains appropriate for their subject. A pure Core helper does not need to call the documentation controller or depend on its props.

The installed `useHttp()` has two behaviors to account for:

- A validation response populates the helper's errors and resolves without a successful result. Keep the demo in an error state and let the reader retry.
- A successful request updates the helper's defaults. Reset must restore the explicit initial options, including after a run with different selections.

Do not start requests on mount or on checkbox changes. Prevent duplicate starts while processing. Cancel an in-flight request on reset or unmount and invalidate its local run identity before cancellation. A late success or failure must not restore an abandoned result. Report failures with a readable message rather than backend exception details.

The resizable frame excludes active controls and changing output from search. Place the guide's stable heading and explanatory text outside that excluded frame so readers can discover the example through search and the page outline.

## Verify a change

Run from the documentation application root:

```sh
php artisan test --compact tests/Feature/CoreConditionalArraysDemoTest.php tests/Feature/ZiggyRoutingTest.php
npm test -- resources/js/components/demo/core/conditional-arrays
composer ci:check
npm run build
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
```

Backend tests must call the actual installed Core API. Check every combination of the two flags, retained values, nested omissions, closure evaluation, numeric keys, validation failures, and independent repeated requests. Verify the named route in the initial Ziggy configuration and after a route-path change. Noindex and no-store response checks belong at the HTTP boundary.

Frontend tests exercise user-controlled requests, actual response rendering, failure and retry, explicit reset defaults, duplicate-start protection, and stale completion after reset or unmount. Isolate the HTTP boundary rather than replacing Core's result with an implementation in JavaScript.

In a production-build browser session, run the initial example, change each option, and compare the returned result. Confirm that the guide URL and metadata stay unchanged. Expand the real source, reset the demo, and test a narrow frame and mobile page. Check keyboard access, loading feedback, recent browser errors, and page overflow. If the server is unavailable, the demo must fail without interfering with the rest of the guide.

Wait for the visible native checkbox roles before exercising their labels in browser automation. The page load event can finish while a component module is still registering. Clicking an undefined custom-element host does not toggle the eventual checkbox. The application browser check waits for both native inputs, then retains the real label clicks and checked-state and server-payload assertions.

No package API changes are required for this demonstration. Keep package usage skills unchanged unless a future change alters the public helper contract. Maintain the guide and examples in `docs` only. The retired legacy source checkout is not a prerequisite; review current rendered-content expectations before changing them.

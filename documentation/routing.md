# Use named routes in the frontend

Laravel owns the application's route names, paths, parameters, and HTTP methods. Use Laravel's `route()` in PHP and the public `ziggy-js` helper when JavaScript needs to generate a URL. Existing documentation navigation and resources already supply named-route URLs from PHP; consume those values directly instead of rebuilding the menu in Vue.

## Generate a URL

Import the helper in a Vue `<script setup>` block:

```vue
<script setup>
import { Link, useForm } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

const form = useForm({ email: '' });

function requestCode() {
    form.post(route('login.email', undefined, false));
}
</script>

<template>
    <Link :href="route('docs.index', undefined, false)">Documentation</Link>
</template>
```

The third argument `false` keeps application URLs relative to the current origin. Keep request methods explicit in Inertia forms and links: generating a route URL does not choose the HTTP method. Login-code requests and verification use POST, logs use a full document GET, and sign out uses an Inertia POST button. Preserve those behaviors when changing route paths.

Use `DocsLink` for documentation destinations and keep its external-link policy. A server-rendered tool such as Log Viewer uses a normal anchor rather than an Inertia page visit.

## Understand configuration ownership

Composer installs `tightenco/ziggy` and npm installs `ziggy-js`, both constrained to `^2.6.5`. Run Composer before npm as with the other application dependencies.

The root Blade document emits `@routes(json: true)` before the Vite application entry. Ziggy's installed JavaScript helper reads that native JSON element on its first use and makes the configuration available to direct imports. `app.ts` installs `ZiggyVue` without a second configuration object. This also supports QZ Tray's public client, which imports `route()` independently of the Vue plugin.

Do not add a custom JSON loader, a second Inertia route configuration, a generated frontend route file, or a manually synchronized route map. The initial document receives the current Laravel route definitions. A fresh document after deployment receives the new route paths. Do not serialize a fixed `location`; Ziggy can read the browser's current location after Inertia navigation. Vue SSR remains disabled.

`config/ziggy.php` filters route names by feature group. Documentation pages share `docs.show`, so registering a new page in `PageSlug` does not require another Ziggy entry. New frontend features with separate route names must add their route group to the existing filter. Keep both QZ Tray connector route names available through `qztray_connector.*`.

The filter limits metadata sent to the browser. Backend authentication and authorization still control access to protected routes. The route list contains definitions rather than private keys or application configuration values.

Wayfinder, its Vite plugin, and its generated `actions`, `routes`, and `wayfinder` directories are removed. Do not restore those imports or generation steps. No route-generation command is required in development, CI, or deployment.

## Verify a routing change

```sh
php artisan test --compact tests/Feature/ZiggyRoutingTest.php tests/Feature/Auth/AuthenticationTest.php
npm test -- resources/js/lib/ziggy.test.js resources/js/pages/auth/Login.test.js resources/js/components/AccountLinks.test.js resources/js/pages/Welcome.test.js
composer ci:check
npm run build
```

Feature tests inspect the actual initial JSON, its filtered route groups, and changed Laravel paths. Frontend tests use the installed public helper to verify login submissions, account links, nested documentation slugs, and direct QZ Tray route resolution before any Vue helper runs. Test configuration fixtures are isolated examples, not a runtime route registry.

If a route is missing in the browser, check its Laravel name and the single Ziggy filter, then reload the document. Do not work around it with a hardcoded path or a copied route definition. Inspect the real browser and repeat the relevant auth tests when changing login or sign-out behavior. Browser verification of these routing changes does not require sending a real login email or performing a real printer operation.

See [Ziggy's official integration documentation](https://github.com/tighten/ziggy) and [Inertia's routing guide](https://inertiajs.com/docs/v3/the-basics/routing) for the public APIs.

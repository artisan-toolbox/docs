---
title: Vue plugin
description: Register the toast service, enable color mode, and configure Mosaicast and Echo.
---

After [installation](../installation/) and [Web Awesome setup](../web-awesome/), add `createFrontAwesome()` to the existing `withApp` hook in your Inertia entry point.

```ts
import { createFrontAwesome } from "@artisan-toolbox/front-awesome";

// In the options passed to createInertiaApp:
withApp(app) {
  app.use(createFrontAwesome());
}
```

The plugin provides the Vue toast service and starts the browser listeners for Inertia flash and Mosaicast events. It adds one Web Awesome toast stack to `document.body`. The stack stays in place as Inertia changes pages. If several Vue apps share a document, the plugin removes the stack and its listeners when the last app unmounts. Server rendering has access to the service.

## Add a theme selector

Pass `theme: true` to let the plugin manage the page's color mode. Apps that already manage color mode can omit this option.

```ts
app.use(createFrontAwesome({ theme: true }));
```

Import `Theme` from `@artisan-toolbox/front-awesome/components` and put your controls in its default slot. The component adds no wrapper element.

```vue
<template>
  <Theme v-slot="{ theme, toggle, system, dark, light }">
    <button type="button" :aria-pressed="theme === 'system'" @click="system">
      System
    </button>
    <button type="button" :aria-pressed="theme === 'dark'" @click="dark">
      Dark
    </button>
    <button type="button" :aria-pressed="theme === 'light'" @click="light">
      Light
    </button>
    <button type="button" @click="toggle">Toggle theme</button>
  </Theme>
</template>

<script setup lang="ts">
import { Theme } from "@artisan-toolbox/front-awesome/components";
</script>
```

`theme` is the selected preference: `system`, `dark`, or `light`. Each matching action selects that preference. `toggle()` selects the opposite of the color mode currently in use. For example, if `system` resolves to dark, `toggle()` selects `light` and stops following system changes. All selectors in the same document share the preference.

If you wrap the selector in your own component, import the `ThemePreference` type from `@artisan-toolbox/front-awesome`.

The plugin reads the `appearance` preference from browser storage and applies the color mode before Vue mounts. It follows the system preference if no valid choice is saved. If storage is unavailable, the controls still work for the current page. During server rendering and hydration, the slot starts at `system` and reads the browser preference after mount. The plugin stops listening for system changes when the last app with theme support unmounts.

The manager sets `dark` and `wa-dark` on `<html>` in dark mode, or `wa-light` in light mode. Your app still supplies the Web Awesome stylesheet, theme, and palette. To make Tailwind's `dark:*` utilities follow the same selection, add this variant after your Tailwind import:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Inertia resolves the initial page before it installs the plugin. If your app must apply the preference before the first paint, use an inline script in the document head that reads the same `appearance` key, defaults to `system`, and applies the same root classes.

## Set placement

The default placement is `top-end`. Set `flashToast.placement` to `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center`, or `bottom-end`. The first app to start the stack sets its placement.

```ts
app.use(
  createFrontAwesome({
    flashToast: { placement: "bottom-end" },
  }),
);
```

## Configure private broadcasts

If your application registers `createMosaicast()` separately, replace that registration with `createFrontAwesome()` and move its options under `mosaicast`. The plugin accepts the Mosaicast options `echo`, `channelPrefix`, `debug`, and `logger`. The first registration supplies these options for the lifetime of the document.

To receive private broadcasts, follow the [Mosaicast Vue plugin setup](../../mosaicast/vue-plugin/) for your broadcaster. Pass the configured Echo instance in the browser. The example uses Reverb.

```ts
import { createFrontAwesome } from "@artisan-toolbox/front-awesome";
import { echo } from "@laravel/echo-vue";

// In the options passed to createInertiaApp:
withApp(app, { ssr }) {
  app.use(
    createFrontAwesome({
      mosaicast: ssr ? undefined : { echo: echo<"reverb">() },
    }),
  );
}
```

Without Echo, the plugin still receives Inertia flash and Mosaicast events delivered in Inertia responses. See [Toasts from Laravel](../toasts/laravel/) to choose a delivery method.

## Start only the toast listener

If you manage Mosaicast registration and app startup yourself, import `initializeFlashToast()` from `@artisan-toolbox/front-awesome/WebAwesome/flashToast`. Call it before starting Inertia. The initializer accepts the same placement option as `flashToast` and returns a cleanup function. If several callers start the stack, it stays active until all of them run their cleanup functions. Use the Vue plugin if you also need `useToast()` or `$frontAwesome`.

The same entry point exports `showToast(message, options)`. It uses the active stack and the same [toast options](../toasts/vue/#toast-options) as the Vue service.

The root package exports the `FrontAwesomeOptions` and `FlashToastOptions` types.

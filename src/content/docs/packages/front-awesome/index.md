---
title: Front Awesome
description: Preview reusable Vue components and Laravel frontend integrations for Inertia.
---

:::caution[Work in progress (WIP)]
Front Awesome is in development and has no stable Composer release. The examples on this page describe the development checkout.
:::

Front Awesome is a Laravel package for reusable Vue components and frontend integrations that complement Inertia. It uses Web Awesome custom elements for UI and Tailwind CSS for styling. VueUse provides composables, and Mosaicast supplies the event delivery layer for future Front Awesome integrations.

## Requirements

- PHP 8.5 or later within the PHP 8.x series and Laravel 13 components
- Vue 3.5 or later within Vue 3.x, Inertia 3.x, and Tailwind CSS 4.x
- Node.js 24.11 or later

## Installation

To work on the package, clone the [source repository](https://github.com/artisan-toolbox/front-awesome) and follow [Validate a checkout](#validate-a-checkout).

### Frontend distribution

The planned application setup installs both packages with Composer before registering their frontend packages through `file:vendor/artisan-toolbox/...` dependencies. The current checkout declares the Mosaicast JavaScript client as a peer at `^0.1.0`. Mosaicast 1.2.0 ships its client at `1.2.0`, which falls outside that range.

Front Awesome supplies Web Awesome and VueUse. The application supplies Vue, Inertia, and Tailwind CSS.

## Configure Vite

Keep the existing Laravel and Inertia plugins in your Vite config. In the existing Vue plugin options, add the custom-element matcher. Keep Tailwind's Vite plugin enabled.

```ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("wa-"),
    },
  },
});
```

If your Vue plugin already recognizes custom elements, extend the existing matcher to recognize `wa-` tags. If you build an Inertia SSR bundle, add `"@artisan-toolbox/front-awesome"` to Vite's `ssr.noExternal` list so it compiles the package's Vue files.

Add the Tailwind source directive through the package stylesheet in the application's CSS entry.

```css
@import "tailwindcss";
@import "@artisan-toolbox/front-awesome/styles.css";
```

Import Web Awesome's stylesheet from the application's JavaScript entry. This gives Vite a separate CSS entry so it can resolve Web Awesome's nested imports.

```ts
import "@artisan-toolbox/front-awesome/web-awesome.css";
```

The application's Vite build compiles the Vue sources and styles. Tailwind scans the package's components for utility classes.

## Render a button

```vue
<template>
  <Button variant="brand">Save changes</Button>
</template>

<script setup lang="ts">
import Button from "@artisan-toolbox/front-awesome/components/Button.vue";
</script>
```

The button passes its default slot and attributes to `<wa-button>`. It registers the custom element when the Vue component mounts in the browser.

For event delivery, configure the [Mosaicast Vue plugin](../mosaicast/vue-plugin/) in the application.

## Validate a checkout

In the Front Awesome repository, write Vue single-file components with the Composition API and `<script setup lang="ts">`. Put `<template>` first and the TypeScript setup block below it.

Run `composer install` before `npm ci`. Use `php vendor/bin/maintainer quality:check --no-interaction` for the configured checks, `composer test` for the PHP suite with type coverage, and `npm run build` to compile the Vite consumer fixture. Maintainer manages release versioning on `1.x`.

Maintainer manages the repository README header. To regenerate it after changing the logo or badges, run `php vendor/bin/maintainer readme:update` from the package checkout with Composer development dependencies installed.

When preparing the first release, replace the `in development` badge in `FrontAwesome::readmeHead()` with the GitHub release badge.

### Use the frontend agent skills

The Front Awesome checkout keeps its skills in `.agents/skills/`. Claude Code can access the same directory through `.claude/skills/`.

- Use `vue-best-practices` for Vue components and composables, and `vue-testing-best-practices` for tests. [Vue AI Skills](https://github.com/vuejs-ai/skills)
- Use `vueuse-functions` to choose VueUse composables. The checkout includes a snapshot for VueUse 14.4.0. [VueUse Skills](https://vueuse.org/guide/work-with-ai)
- Use `inertia-vue-development` for Inertia 3 forms, navigation, shared props, and SSR. The local skill directs agents to the Boost template bundled with the installed Vue adapter. [Inertia Vue skill source](https://github.com/inertiajs/inertia/tree/3.x/packages/vue3/resources/boost/skills/inertia-vue-development)
- Use `frontend-design` to choose a visual direction for new or redesigned interfaces. Use it with `webawesome-design` to carry that direction into Web Awesome components and tokens. [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design)
- Use `webawesome` for component APIs and `webawesome-design` for layout and theming. Both links resolve to the installed Web Awesome version. [Web Awesome agent skills](https://webawesome.com/docs/ai/agent-skills)

Run `composer install` before `npm ci` to make the Inertia and Web Awesome references available.

## Resources

- [Source code and changelog](https://github.com/artisan-toolbox/front-awesome)

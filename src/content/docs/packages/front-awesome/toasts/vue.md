---
title: Show toasts from Vue
description: Use the toast composable or global Vue service and configure TypeScript and ESLint.
---

After you [register the Vue plugin](../../vue-plugin/), use the toast service to respond to actions in the browser. Vue toasts use the same stack as toasts sent from Laravel.

## Use the Composition API

Call `useToast()` in component setup and call `show()` when you want to display a notification.

```vue
<template>
  <button type="button" @click="copyReportLink">Copy link</button>
</template>

<script setup lang="ts">
import { useToast } from "@artisan-toolbox/front-awesome";

const toast = useToast();

async function copyReportLink() {
  await navigator.clipboard.writeText(window.location.href);
  await toast.show("Report link copied.", {
    variant: "success",
    icon: "check",
  });
}
</script>
```

## Use a template or the Options API

The plugin exposes the same service as `$frontAwesome.toast`. In a template, call `$frontAwesome.toast.show(message, options)`. In an Options API method, use `this.$frontAwesome.toast.show(message, options)`.

```ts
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    async notifySaved() {
      await this.$frontAwesome.toast.show("Report saved.", {
        variant: "success",
      });
    },
  },
});
```

## Toast options

The second argument to `show()` is optional. Its type is `ToastOptions`.

| Option      | Accepted values                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `brand`, `success`, `warning`, `danger`, or `neutral`. Defaults to `neutral`.                                               |
| `duration`  | A non-negative integer in milliseconds. Use `0` to wait for dismissal.                                                      |
| `icon`      | An icon name or an object with `name` and optional `library`, `family`, and `variant` strings. Pass an icon to display one. |
| `size`      | `xs`, `s`, `m`, `l`, or `xl`. Defaults to `m`.                                                                              |
| `allowHtml` | Defaults to plain text. Set to `true` only for trusted HTML.                                                                |

In the browser, `show()` resolves when Web Awesome creates the toast. It rejects if the arguments are invalid or Web Awesome cannot load or create the toast. During server rendering, a valid call resolves without displaying a toast. The browser ignores malformed toast payloads received through Inertia or Mosaicast.

## Check types and lint rules

The root package exports `ToastOptions`, `ToastIconOptions`, and `ToastService`. Use `import type` when declaring a shared options object or a wrapper around the service.

The root package import also declares `$frontAwesome` in [Vue's component instance types](https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties). Run `vue-tsc --noEmit` against the TypeScript project that includes your Vue files. If that project excludes the entry point that imports `createFrontAwesome()`, add a declaration file such as `resources/js/front-awesome.d.ts` and include it in the project's `tsconfig`.

```ts
import "@artisan-toolbox/front-awesome";
```

The ESLint rule [`vue/no-undef-properties`](https://eslint.vuejs.org/rules/no-undef-properties.html) ignores names starting with `$` by default. If your Vue rules override that behavior and flag `$frontAwesome`, add the exact name to the rule's `ignores` list. Keep any existing entries.

```json
{
  "vue/no-undef-properties": ["error", { "ignores": ["$frontAwesome"] }]
}
```

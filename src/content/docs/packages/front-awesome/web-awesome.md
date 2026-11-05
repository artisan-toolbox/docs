---
title: Web Awesome setup
description: Configure Vite, use your application's theme, and select Web Awesome Core or Pro.
---

Front Awesome wraps Web Awesome custom elements. It includes Web Awesome Core and VueUse. The application supplies Vue, Inertia, and Tailwind CSS.

## Configure Vite

Add `frontAwesome()` from `@artisan-toolbox/front-awesome/vite` to your existing Vite plugins. Keep the Laravel, Inertia, and Tailwind plugins in place. In the existing Vue plugin configuration, recognize `wa-` tags as custom elements.

```ts
import { frontAwesome } from "@artisan-toolbox/front-awesome/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Keep your existing Laravel, Inertia, and Tailwind plugins here.
    frontAwesome(),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("wa-"),
        },
      },
    }),
  ],
});
```

If your Vue plugin already recognizes custom elements, extend the existing matcher. If you build an Inertia SSR bundle, add `"@artisan-toolbox/front-awesome"` to Vite's `ssr.noExternal` list so Vite compiles the package's Vue files.

## Load styles

Import the package's Tailwind source stylesheet after Tailwind in the application CSS entry. Tailwind uses the source directive to scan the package's Vue components for utility classes.

```css
@import "tailwindcss";
@import "@artisan-toolbox/front-awesome/styles.css";
```

If the application already loads Web Awesome styles, keep its existing setup. To load the standard Web Awesome stylesheet, import the optional stylesheet in the JavaScript entry. Vite can then resolve the nested CSS imports.

```ts
import "@artisan-toolbox/front-awesome/web-awesome.css";
```

Front Awesome components inherit the active Web Awesome theme and the application's `--wa-*` tokens. Set colors, typography, and spacing in the application. To manage light and dark mode with Front Awesome, [add a theme selector](../vue-plugin/#add-a-theme-selector).

## Choose Core or Pro

The Vite plugin prefers the application's installed `@web.awesome.me/webawesome-pro` package. It otherwise uses the application's Core installation or the Core copy supplied by Front Awesome. The plugin selects the edition for Front Awesome's button, button group, toast, and optional Web Awesome stylesheet.

| Vite option                            | Edition                                              |
| -------------------------------------- | ---------------------------------------------------- |
| `frontAwesome()`                       | Pro when installed. Core otherwise.                  |
| `frontAwesome({ webAwesome: "core" })` | Core.                                                |
| `frontAwesome({ webAwesome: "pro" })`  | Pro. Install Pro in the application before building. |

Import native components directly from the edition your application uses. For example, a Pro app can import `@web.awesome.me/webawesome-pro/dist/components/icon/icon.js`. The Vite plugin only changes Front Awesome's internal imports. Use one edition on each page because both editions register the same custom element names. If you previously added an alias for the entire Core package, remove it and rebuild.

---
title: Front Awesome
description: Use Vue components, manage color mode, and send toast notifications in Laravel applications with Inertia.
---

Front Awesome adds Web Awesome components, color mode controls, and toast notifications to Laravel applications that use Inertia and Vue. Components inherit the application's theme. Toasts can come from Laravel or from Vue.

:::caution[Work in progress (WIP)]
This guide covers the `1.x` development branch. Front Awesome has no stable Composer release.
:::

## Requirements

- PHP 8.5 or later within PHP 8.x, Laravel 13, and Inertia Laravel 3.x
- Vue 3.5 or later within Vue 3.x, Inertia Vue 3.x, and Tailwind CSS 4.x
- Mosaicast 1.1.1 or later within Mosaicast 1.x
- Node.js 24.11 or later

## Installation

Follow [Installation](./installation/) to install the Composer and frontend packages in an Inertia application.

## Show your first toast

After installing the package and [registering the Vue plugin](./vue-plugin/), add this call to a Laravel action with an active web session.

```php
use ArtisanToolbox\FrontAwesome\Facades\Toast;

Toast::success('Report saved.')->flash();
```

The next Inertia response displays a success toast with the default success icon.

## Guides

- <span id="frontend-distribution"></span>[Installation](./installation/) covers Composer, npm, and refreshing local package copies.
- <span id="configure-vite"></span><span id="use-your-applications-theme"></span><span id="use-web-awesome-pro"></span>[Web Awesome setup](./web-awesome/) covers Vite, styles, and the Core and Pro editions.
- <span id="set-default-icons-by-variant"></span>[Package configuration](./configuration/) covers publishing the Laravel configuration and choosing default toast icons.
- <span id="register-the-front-awesome-vue-plugin"></span>[Vue plugin](./vue-plugin/) covers registration, the theme selector, toast placement, and Echo.
- <span id="render-a-button"></span>[Buttons and button groups](./button/) shows how to use the typed Vue wrappers.
- <span id="show-toast-notifications-from-laravel"></span><span id="send-a-notification"></span><span id="configure-a-toast"></span>[Toasts from Laravel](./toasts/laravel/) covers the facade, factory options, and both delivery methods.
- <span id="show-a-toast-from-vue"></span><span id="check-frontawesome-in-your-editor-and-ci"></span>[Toasts from Vue](./toasts/vue/) covers the composable, the Vue global service, and TypeScript.
- <span id="validate-a-checkout"></span><span id="use-the-frontend-agent-skills"></span>[Development](./development/) covers the package checkout, tests, and coverage.

<span id="resources"></span>Find the [source code and changelog](https://github.com/artisan-toolbox/front-awesome) on GitHub.

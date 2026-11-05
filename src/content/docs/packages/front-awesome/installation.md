---
title: Install Front Awesome
description: Install the development package with Composer and register its frontend packages with npm.
---

Start in an existing Laravel application with Inertia, Vue, and Vite. Check the [requirements](../#requirements) before installing the development branch.

## Install the Composer package

Clone the [Front Awesome repository](https://github.com/artisan-toolbox/front-awesome) and check out `1.x`. In the application root, point Composer to that checkout. Replace the example path with your checkout's path.

```sh
composer config repositories.front-awesome path /path/to/front-awesome
composer require "artisan-toolbox/front-awesome:1.x-dev"
```

Composer installs Front Awesome and Mosaicast under `vendor/artisan-toolbox`. Laravel discovers the Front Awesome service provider automatically.

## Install the frontend packages

From the application root, run the npm command after Composer has installed both packages.

```sh
npm install --install-links ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast
```

The command records both packages as `file:` dependencies in the application's `package.json`. Keep both entries. Front Awesome declares the Mosaicast JavaScript client as a peer dependency, even though Composer installs Mosaicast for PHP.

Set `install-links=true` in the application's `.npmrc` so `npm ci` uses the same install mode. Run Composer before npm in development, CI, and deployments. The application's Vite build compiles the installed Front Awesome sources.

## Refresh a local package copy

With `install-links=true`, npm packs and copies each local dependency into `node_modules`. If Composer links `vendor/artisan-toolbox/front-awesome` to your checkout, edits reach `vendor` immediately. Run `npm ci` in the consuming application to refresh the copy in `node_modules`, then restart the running Vite server.

Reload the page without the browser cache after replacing the local copy. Vite serves dependency URLs with long-lived cache headers. If the package version stays the same, an open tab can load an older plugin alongside a newer Vue component.

## Set up the application

Follow [Web Awesome setup](../web-awesome/) to configure Vite and choose how to load styles. For toast notifications, [register the Vue plugin](../vue-plugin/) before sending your first toast.

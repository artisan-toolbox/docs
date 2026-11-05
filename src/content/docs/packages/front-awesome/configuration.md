---
title: Package configuration
description: Publish the Laravel configuration and customize default toast icons by variant.
---

Front Awesome loads its PHP defaults when Laravel discovers the package. Publish the file to customize those defaults in your application.

```sh
php artisan vendor:publish --tag=front-awesome-config
```

Laravel copies the file to `config/front-awesome.php`. If your deployment caches configuration, rebuild the config cache after editing the file.

## Default toast icons

The `webawesome.toast.icons` map contains one entry per variant. Laravel reads the map when a [toast factory](../toasts/laravel/) sends a toast without an explicit icon.

| Variant   | Default icon           |
| --------- | ---------------------- |
| `brand`   | `bell`                 |
| `success` | `circle-check`         |
| `warning` | `triangle-exclamation` |
| `danger`  | `circle-exclamation`   |
| `neutral` | `circle-info`          |

Each entry accepts an icon name, an array with `name` and optional `library`, `family`, and `variant` strings, or `null` to disable the default for that variant. You can keep just the overrides in the application's file.

```php
<?php

return [
    'webawesome' => [
        'toast' => [
            'icons' => [
                'success' => ['name' => 'tick', 'library' => 'my-icons'],
                'neutral' => null,
            ],
        ],
    ],
];
```

In this example, a Laravel success toast uses the `tick` icon from `my-icons`. Register custom icon libraries in the browser before displaying toasts. A Laravel neutral toast has no icon by default. Variants omitted from the map retain the package defaults. An explicit icon on a toast takes priority over the configuration.

For toasts created with the Vue service, pass an icon in the [`show()` options](../toasts/vue/#toast-options). Set the stack position and Echo options in the [Vue plugin](../vue-plugin/).

---
title: Dump to Console
description: Send Laravel debug output to a local console without interrupting the application.
sidebar:
  badge: 1.x
  order: 3
---

Dump to Console sends Laravel dumps to a local console listener without stopping the application or changing its response, stream, download, or command output.

## Requirements

- PHP 8.5 or later
- Laravel 13 components

## Installation

```bash
composer require artisan-toolbox/dump-to-console
```

Start the listener in a terminal:

```bash
php artisan dump:listen
```

Send values from the application with the `dc()` helper:

```php
$order = dc(Order::find($id));

dc(
    request: $request->all(),
    order: $order,
);
```

The helper returns the values it receives, allowing it to be used inline. Delivery is best effort, so an unavailable listener does not interrupt the application.

Continue with the [usage and configuration guide](./usage/) for listener options, named values, fluent dumps, benchmarks, and configuration.

## Security

The dump protocol has no authentication or encryption. Keep the listener bound to a trusted local interface and handle dumped values with the same care as local logs.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/dump-to-console)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/dump-to-console)

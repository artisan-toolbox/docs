---
title: Dump to Console
description: Send Laravel debug output to a local console without interrupting the application.
---

Dump to Console sends Laravel dumps to a local console listener without stopping the application or changing its response, stream, download, or command output.

Dump to Console 1.1 installs Maintainer as a runtime dependency so its versioning contracts remain available after `composer install --no-dev`.

## Requirements

- PHP 8.5 or later within the PHP 8.x series
- Laravel 13 components

## Installation

```bash
composer require artisan-toolbox/dump-to-console:^1.1
```

## Send your first dump

Start the listener in a terminal:

```bash
php artisan dump:listen
```

Send values from the application with the `dc()` helper:

```php
$order = dc(Order::find($id));

dc(orderId: $order?->id);
```

The terminal shows each value and its source location when available. The helper returns the values it receives, so it works inline. An unavailable listener does not interrupt the application.

## Guides

Continue with the [usage and configuration guide](./usage/) for listener options, named values, fluent dumps, benchmarks, and configuration.

## Security

The dump protocol has no authentication or encryption. Keep the listener bound to a trusted local interface and handle dumped values with the same care as local logs.

## Development

Run `composer analyse` from the package root. Larastan uses the package's `config/` directory to recognize valid `env()` calls, including those in local Maintainer configuration.

On Windows, Dump to Console's CI requires PHPStan 2.2.8 or later in the 2.x series. This version fixes a Turbo parser bug that can drop PHPDoc comments during static analysis.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/dump-to-console)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/dump-to-console)

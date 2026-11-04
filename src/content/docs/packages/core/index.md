---
title: Core
description: Shared foundations, contracts, utilities, and common components for Artisan Toolbox packages.
---

Core provides stable building blocks shared by Artisan Toolbox packages. Applications normally receive it as a transitive dependency, but it can also be installed directly when its public components are needed.

Core 1.1 added Sift. Core 1.2 installs Maintainer as a runtime dependency so its versioning contracts are available in production.

## Requirements

- PHP 8.5 or later within the PHP 8.x series
- Laravel 13 components
- Inertia Laravel 3.x

## Installation

```bash
composer require artisan-toolbox/core:^1.2
```

Laravel discovers Core's service provider and registers the Sift macros.

## Build a conditional payload

```php
use Illuminate\Support\Arr;

use function ArtisanToolbox\Core\sift_when;

$payload = Arr::sift([
    'name' => $user->name,
    'email' => sift_when($canViewEmail, fn () => $user->email),
]);
```

When `$canViewEmail` is `false`, `$payload` contains only `name`.

## Features

- [Sift conditional arrays](./conditional-arrays/): include values conditionally and recursively remove rejected entries from arrays and other iterables.
- [Multi-domain Inertia visits](./multi-domain-inertia/): keep Inertia navigation working when links move between trusted domains or subdomains served by the same Laravel application.
- [Translated model attributes](./translated-attributes/): store stable translation keys while exposing localized strings from Eloquent models.

## Published resources

The features above work without publishing resources or running migrations. Run the following command to publish all bundled resources together.

```bash
php artisan vendor:publish --tag="core"
```

Individual publish tags are available for configuration, migrations, views, translations, and public assets:

```bash
php artisan vendor:publish --tag="core-config"
php artisan vendor:publish --tag="core-migrations"
php artisan vendor:publish --tag="core-views"
php artisan vendor:publish --tag="core-lang"
php artisan vendor:publish --tag="core-assets"
```

The bundled migration creates a `core_placeholder` table. Run it only if you need that table in a development application.

```bash
php artisan migrate
```

## Development

On Windows, Core's CI requires PHPStan 2.2.8 or later in the 2.x series. This version fixes a Turbo parser bug that can drop PHPDoc comments during static analysis.

## Source and releases

- [Source code](https://github.com/artisan-toolbox/core)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/core)

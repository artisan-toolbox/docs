---
title: Core
description: Shared foundations, contracts, utilities, and common components for Artisan Toolbox packages.
sidebar:
  badge: 1.x
  order: 1
---

Core provides stable building blocks shared by Artisan Toolbox packages. Applications normally receive it as a transitive dependency, but it can also be installed directly when its public components are needed.

## Requirements

- PHP 8.5 or later
- Laravel 13 components

## Installation

```bash
composer require artisan-toolbox/core
```

## Features

- [Multi-domain Inertia visits](./multi-domain-inertia/): keep Inertia navigation working when links move between trusted domains or subdomains served by the same Laravel application.
- [Translated model attributes](./translated-attributes/): store stable translation keys while exposing localized strings from Eloquent models.

## Published resources

Publish all package resources:

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

Run migrations after publishing them:

```bash
php artisan migrate
```

## Source and releases

- [Source code](https://github.com/artisan-toolbox/core)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/core)

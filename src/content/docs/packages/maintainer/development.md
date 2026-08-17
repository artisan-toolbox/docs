---
title: Development and Building
description: Develop, validate, and build the Maintainer PHAR.
sidebar:
  order: 5
---

Internal support services are grouped by responsibility under `app/Support`. Configuration loading, diff generation, Git inspection, and GitHub release workflows live in the `Configuration`, `Diff`, `Git`, and `Release` namespaces. Standalone utilities remain at the support root until they have related services.

## Local development

Clone the repository and install dependencies:

```bash
composer install
```

List available commands:

```bash
php maintainer list
```

Run automated tests:

```bash
vendor/bin/pest
```

Check and apply code style:

```bash
vendor/bin/pint --test
vendor/bin/pint
```

## Building

Compile Maintainer as a standalone PHAR with Laravel Zero:

```bash
php maintainer app:build
```

The compiled application is written to `builds/maintainer`. Composer exposes this distributed PHAR as `vendor/bin/maintainer` in consuming projects.

## Contribution conventions

Contributions must include automated tests for observable behavior and keep documentation synchronized with changed commands.

Prefer native PHP attributes whenever the framework or library provides an attribute equivalent to legacy metadata properties or configuration. Console commands should use Laravel's `Signature` and `Description` attributes instead of the `$signature` and `$description` properties. Use a legacy form only when no compatible attribute exists.

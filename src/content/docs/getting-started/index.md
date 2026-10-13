---
title: Getting Started
description: Learn how the Artisan Toolbox documentation and packages are organized.
sidebar:
  order: 1
---

Artisan Toolbox is a collection of focused Laravel packages and developer tools. Each package can be adopted independently, while shared foundations live in the Core package.

## Requirements

Requirements vary by package. Check the package page before installing it. The current package generation targets:

- PHP 8.5 or later
- Laravel 13 components
- Composer 2

## Install a package

Packages are distributed through Packagist and installed with Composer:

```bash
composer require artisan-toolbox/<package>
```

Replace `<package>` with the package name, such as `core` or `dump-to-console`.

Packages with frontend features may also require an npm dependency. For QZ Tray Connector, install both `artisan-toolbox/qztray` and `@artisan-toolbox/qztray`, then follow its [quickstart](/packages/qztray/#quickstart) to configure credentials and Ziggy routes.

## Next step

Read [Choose a Package](./choose-a-package/) for a quick comparison, or browse the complete [package catalog](/packages/).

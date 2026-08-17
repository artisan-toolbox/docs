---
title: Maintainer
description: Automated validation, quality assurance, versioning, and release workflows.
sidebar:
  badge: 1.x beta
  order: 1
---

Maintainer provides a single entry point for repetitive package and application maintenance tasks, including validation, commits, versioning, changelogs, and GitHub releases.

:::caution[Development status]
Maintainer is under active development. Commands and public behavior may change while the initial workflows are established.
:::

## Requirements

- PHP 8.5 or later
- Composer
- Git
- GitHub CLI for workflows that interact with GitHub

## Installation

Install Maintainer as a development dependency:

```bash
composer require --dev artisan-toolbox/maintainer
```

Open its interactive menu:

```bash
vendor/bin/maintainer
```

The PHAR contains Maintainer's runtime dependencies, keeping them isolated from the dependencies of the project being maintained.

Initialize project configuration:

```bash
vendor/bin/maintainer init
```

## Common workflows

```bash
vendor/bin/maintainer quality
vendor/bin/maintainer commit
vendor/bin/maintainer release:create
```

## Learn more

- [Configuration](./configuration/)
- [Project integration](./project-integration/)
- [Commands and workflows](./commands/)
- [Development and building](./development/)

## Source and releases

- [Source code](https://github.com/artisan-toolbox/maintainer)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/maintainer)

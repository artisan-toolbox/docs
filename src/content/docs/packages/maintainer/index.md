---
title: Maintainer
description: Automated validation, quality assurance, versioning, and release workflows.
sidebar:
  badge: Development
  order: 3
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

## Source and releases

- [Source code](https://github.com/artisan-toolbox/maintainer)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/maintainer)

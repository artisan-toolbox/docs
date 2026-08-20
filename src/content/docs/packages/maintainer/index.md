---
title: Maintainer
description: Automated validation, quality assurance, versioning, and release workflows.
sidebar:
  badge: 1.x
  order: 4
---

Maintainer provides a single entry point for repetitive package and application maintenance tasks, including validation, commits, versioning, changelogs, deployments, and GitHub releases.

## Requirements

- PHP 8.5 or later
- Composer
- Git
- GitHub CLI for workflows that interact with GitHub

## Installation

Install Maintainer as a development dependency:

```bash
composer require --dev artisan-toolbox/maintainer:^1.0
```

Open its interactive menu:

```bash
vendor/bin/maintainer
```

The PHAR contains Maintainer's runtime dependencies, keeping them isolated from the dependencies of the project being maintained.

Initialize project configuration:

```bash
vendor/bin/maintainer config:publish
```

## Common workflows

Maintainer's documentation follows the same groups as its interactive menu:

- [CI](./ci/): run Pint, Rector, PHPStan, and Pest together or as a selected subset.
- [Configuration](./configuration/): publish templates and manage settings, secrets, and SSH keys.
- [Deployment](./deployment/): run and unlock Deployer or attach shared repository and PM2 tasks.
- [Versioning](./versioning/): review diffs, create commits, and publish GitHub releases.

Open a feature page for its requirements, configuration, examples, interactive behavior, automation behavior, and failure conditions.

## Learn more

- [Command index](./commands/)
- [Project integration](./versioning/project-integration/)
- [Development and building](./development/)

## Source and releases

- [Source code](https://github.com/artisan-toolbox/maintainer)
- [Packagist releases](https://packagist.org/packages/artisan-toolbox/maintainer)

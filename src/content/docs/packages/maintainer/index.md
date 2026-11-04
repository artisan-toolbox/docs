---
title: Maintainer
description: Automated validation, quality assurance, versioning, and release workflows.
---

Maintainer provides a single entry point for repetitive package and application maintenance tasks, including validation, commits, versioning, changelogs, deployments, and GitHub releases.

This guide covers Maintainer 1.10. If your version class still uses `WithReadmeBadgeVersion`, follow the [README badge migration](./versioning/project-integration/#migrate-an-existing-version-badge).

## Requirements

- PHP 8.5 or later within the PHP 8.x series
- Composer
- Git
- GitHub CLI for workflows that interact with GitHub

## Installation

Install Maintainer as a development dependency:

```bash
composer require --dev artisan-toolbox/maintainer:^1.10
```

The PHAR bundles Maintainer's CLI dependencies and keeps them separate from the project being maintained.

## Open the menu

Open its interactive menu:

```bash
vendor/bin/maintainer
```

The menu groups commands by workflow. Run `vendor/bin/maintainer list` to see the available command names.

Initialize project configuration:

```bash
vendor/bin/maintainer config:publish
```

## Common workflows

Maintainer's documentation follows the same groups as its interactive menu:

- [Code Quality](./ci/): apply automated fixes and run PHP and frontend checks as configurable workflows.
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

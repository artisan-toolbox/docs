---
title: Quality Checks
description: Run Pint, Rector, PHPStan, and Pest as one local or CI workflow.
sidebar:
  order: 1
---

## Install the tools

Install the tools in the consuming project using constraints compatible with that project's PHP and Laravel versions:

```bash
composer require --dev laravel/pint rector/rector driftingly/rector-laravel larastan/larastan pestphp/pest
```

Maintainer recognizes these project configuration files:

- `pint.json`;
- `rector.php`;
- `phpstan.neon`, `phpstan.neon.dist`, or `phpstan.dist.neon`;
- `phpunit.xml` or `phpunit.xml.dist` for Pest.

Use [Configuration Publishing](/packages/maintainer/configuration/publishing/) to create recommended templates. Application and package templates use different source and test paths, so Maintainer asks for the project type when necessary and suggests the type inferred from `composer.json`.

## Run the complete workflow

```bash
vendor/bin/maintainer quality
```

This runs Pint, Rector, PHPStan, and Pest in order. The workflow stops at the first failure and returns that tool's exit code.

## Select tools

Pass `--tool` once to run one tool or repeat it to run a subset:

```bash
vendor/bin/maintainer quality --tool=pint
vendor/bin/maintainer quality --tool=phpstan
vendor/bin/maintainer quality --tool=pint --tool=pest
```

Supported values are `pint`, `rector`, `phpstan`, and `pest`. An unsupported value stops the workflow before any tool starts. In the interactive menu, the **CI** submenu exposes the same selection as a multi-select.

## Configure PHPStan memory

Maintainer passes `quality.phpstan.memory_limit` to PHPStan as an explicit `--memory-limit` argument. The default is `2G`:

```php
<?php

return [
    'quality' => [
        'phpstan' => [
            'memory_limit' => '4G',
        ],
    ],
];
```

Valid values include `512M`, `4G`, a byte count, or `-1` for unlimited memory. The environment variable `MAINTAINER_PHPSTAN_MEMORY_LIMIT` configures the distributed template.

## Interactive and CI behavior

When configuration is missing, an interactive run offers to publish the recommended template without overwriting existing files. A non-interactive run fails and identifies the required file.

After all selected tools succeed, an interactive run checks the Git working tree and offers to continue into the [Commit workflow](/packages/maintainer/versioning/commits/) when changes exist. Continuous integration never receives this prompt and never creates a commit.

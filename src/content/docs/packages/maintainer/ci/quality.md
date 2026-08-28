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

On POSIX systems, Maintainer runs each project quality binary with the same PHP interpreter that started Maintainer. The workflow therefore does not depend on which `php` executable appears first in the project's `PATH`.

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

## Run Pest in parallel

Parallel execution is opt-in and disabled by default. Enable it in the Maintainer configuration when the project's tests isolate shared resources such as databases, files, and caches:

```php
<?php

return [
    'quality' => [
        'pest' => [
            'parallel' => true,
        ],
    ],
];
```

When enabled, Maintainer passes Pest's native `--parallel` flag. The distributed template also accepts `MAINTAINER_PEST_PARALLEL=true`, which is convenient for enabling parallel execution only in CI.

## Interactive and CI behavior

When configuration is missing, an interactive run offers to publish the recommended template without overwriting existing files. A non-interactive run fails and identifies the required file.

After all selected tools succeed, an interactive run checks the Git working tree and offers to continue into the [Commit workflow](/packages/maintainer/versioning/commits/) when changes exist. Continuous integration never receives this prompt and never creates a commit.

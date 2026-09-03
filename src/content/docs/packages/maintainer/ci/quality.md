---
title: Fixes and CI Checks
description: Apply automated fixes and run configured PHP and frontend quality checks.
sidebar:
  order: 1
---

Maintainer exposes two code-quality workflows:

- `quality:fix` applies changes with Pint, Rector, and `vp check --fix`;
- `quality:check` runs Pest, Pint in test mode, `vp check`, `vp test`, `vue-tsc --noEmit`, and PHPStan.

Each workflow reads an ordered list of public command contracts from the Maintainer configuration. All configured commands are selected by default in the interactive multi-select. A non-interactive invocation runs the complete configured list.

## Requirements and skipped commands

PHP commands run only when both the project binary and a recognized configuration file exist:

| Command | Required binary      | Recognized configuration                                    |
| ------- | -------------------- | ----------------------------------------------------------- |
| Pint    | `vendor/bin/pint`    | `pint.json`                                                 |
| Rector  | `vendor/bin/rector`  | `rector.php`                                                |
| Pest    | `vendor/bin/pest`    | `phpunit.xml` or `phpunit.xml.dist`                         |
| PHPStan | `vendor/bin/phpstan` | `phpstan.neon`, `phpstan.neon.dist`, or `phpstan.dist.neon` |

Frontend commands require `package.json`, the corresponding local binary under `node_modules/.bin`, and a package script that invokes the expected command. Maintainer discovers the script by its contents rather than its name. For example, all of these names are valid:

```json
{
  "scripts": {
    "frontend-quality": "vp check",
    "paca-tatu": "vp test run",
    "types:vue": "vue-tsc --noEmit"
  }
}
```

Vite+ commands require `node_modules/.bin/vp`; the Vue type check requires `node_modules/.bin/vue-tsc`. Maintainer invokes the discovered script through the package manager declared by `packageManager`, or infers pnpm, Yarn, or Bun from its lock file. It falls back to npm.

When any requirement is missing, Maintainer emits a `Skipped` warning and continues with the next selected command. A command that starts and exits unsuccessfully still stops the workflow and returns its exit code.

## Apply fixes

```bash
vendor/bin/maintainer quality:fix
```

The default order is Pint, Rector, then the package script containing `vp check --fix`. After every successful interactive fix workflow, Maintainer offers to run the complete configured `quality:check` workflow, defaulting to yes. When the checks succeed or are declined, Maintainer asks whether to commit the resulting changes if at least one fixer ran and the working tree is dirty. Only an explicit confirmation starts the commit workflow and its optional diff review. Non-interactive runs do not prompt for checks or offer to create a commit.

## Run CI checks

```bash
vendor/bin/maintainer quality:check --no-interaction
```

The default order is Pest, Pint test, the package scripts containing `vp check`, `vp test`, and `vue-tsc --noEmit`, then PHPStan. The check workflow never modifies the selection based on availability: configured but unavailable commands remain visible and report why they were skipped.

### GitHub Actions

Use one non-interactive Maintainer invocation as the job's quality gate. In consuming projects, Composer installs Maintainer under `vendor/bin`; there is no project-root `maintainer` executable. Invoke it as `php vendor/bin/maintainer`, after installing every PHP and frontend dependency required by the configured checks:

```yaml
name: Code Quality

on:
  pull_request:
  push:

permissions:
  contents: read

jobs:
  check:
    name: Check
    runs-on: ubuntu-latest

    steps:
      - name: Check out the repository
        uses: actions/checkout@v6

      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.5"
          coverage: none
          tools: composer:v2

      - name: Install Composer dependencies
        run: composer install --no-interaction --no-progress --prefer-dist

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Install frontend dependencies
        run: npm ci

      - name: Run configured quality checks
        run: php vendor/bin/maintainer quality:check --no-interaction
```

Adapt the Node.js version and package-manager install command to the consuming project's lock file. Projects without configured frontend checks can omit the Node.js and frontend dependency steps.

`quality:check` returns the first executed command's non-zero exit code, so GitHub Actions fails the job naturally. Missing binaries or configuration files are reported as `Skipped` and do not fail the workflow. Consequently, the job must install every dependency and retain every configuration file that CI is expected to enforce; a successful job does not prove that a skipped tool ran.

The `--no-interaction` option is required in CI. It selects the complete configured `quality.test` list without opening the interactive tool selector. To create intentionally smaller jobs, combine it with one or more `--tool` options, for example:

```yaml
- name: Run PHP checks
  run: php vendor/bin/maintainer quality:check --no-interaction --tool=pest --tool=pint --tool=phpstan
```

## Select a subset

Pass `--tool` once or repeat it. Tool names are scoped to their workflow:

```bash
vendor/bin/maintainer quality:fix --tool=pint
vendor/bin/maintainer quality:check --tool=pest --tool=phpstan
vendor/bin/maintainer quality:check --tool=vite-plus-test
```

The interactive menu uses the configured FQCN values internally. Direct invocations accept either the command's short name or its FQCN.

## Configure workflow commands

Override `quality.fix` or `quality.test` with an ordered list of the built-in public contract FQCNs. Lists replace the distributed defaults instead of merging by numeric index. Composer explicitly exports `ArtisanToolbox\Maintainer\Quality\Contracts` without exposing the package's complete `app/` directory; project configuration must not reference Maintainer's private `App\Support\...` implementation classes.

```php
<?php

use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck;
use ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix;

return [
    'quality' => [
        'fix' => [
            RunsPintFix::class,
        ],
        'test' => [
            RunsPestCheck::class,
            RunsPhpStanCheck::class,
        ],
    ],
];
```

The distributed defaults are:

```php
'quality' => [
    'fix' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsRectorFix::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheckFix::class,
    ],
    'test' => [
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPestCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPintCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVitePlusTest::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsVueTscCheck::class,
        ArtisanToolbox\Maintainer\Quality\Contracts\RunsPhpStanCheck::class,
    ],
],
```

Maintainer resolves each public `Runs...` contract to its bundled implementation. The contract name distinguishes fixes from checks even when both use the same tool—for example, `RunsPintFix` modifies files while `RunsPintCheck` only verifies them. The contracts are the supported configuration surface; internal command class names may change without notice.

## Pest and PHPStan options

Parallel Pest execution remains opt-in:

```php
'quality' => [
    'pest' => [
        'parallel' => true,
    ],
],
```

PHPStan uses a `2G` memory limit by default. Valid configured values include `512M`, `4G`, a byte count, or `-1`:

```php
'quality' => [
    'phpstan' => [
        'memory_limit' => '4G',
    ],
],
```

The environment variables `MAINTAINER_PEST_PARALLEL` and `MAINTAINER_PHPSTAN_MEMORY_LIMIT` configure these options in the distributed template.

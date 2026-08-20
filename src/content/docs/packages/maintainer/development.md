---
title: Development and Building
description: Develop, validate, and build the Maintainer PHAR.
sidebar:
  order: 5
---

Internal support services are grouped by responsibility under `app/Support`. Configuration loading, diff generation, Git inspection, and GitHub release workflows live in the `Configuration`, `Diff`, `Git`, and `Release` namespaces. Standalone utilities remain at the support root until they have related services.

## Path roots

Maintainer distinguishes its own Laravel Zero application root from the consuming Composer project's root. Use Laravel's `base_path()`, `config_path()`, and `resource_path()` helpers for files owned by Maintainer. Use `project_path()` for the consuming project:

```php
$root = project_path();
$deployer = project_path('vendor/bin/dep');
```

Relative project paths may use `/` or `\`; `project_path()` normalizes them to the current operating system's directory separator. Code that intentionally operates on an explicitly supplied root, such as an isolated repository fixture or reusable filesystem service, should use Illuminate Filesystem's `join_paths()` instead.

## Local development

Clone the repository and install dependencies:

```bash
composer install
```

List available commands:

```bash
php maintainer list
```

The source application sets `app.user_config_prefix` to `dev_`. Local user values therefore live in `config/dev_maintainer.php` and `config/dev_maintainer_secrets.php`, keeping them separate from the unprefixed defaults packaged under `config/`. The prefixed secrets path should remain ignored by Git.

Run automated tests:

```bash
vendor/bin/pest
```

GitHub Actions runs the suite on Ubuntu and Windows. Tests that execute a Composer proxy through Symfony Process should assert the forwarded argument values without depending on the shell's serialized command-line quotes. Deployer executes localhost and remote task commands through Bash, including on the Windows runner, so fake executables used by Deployer task tests must be POSIX shell scripts. Path assertions should use `join_paths()` or normalize separators explicitly.

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

The Box manifest uses an explicit allowlist for distributed files under `config/`. Local `config/dev_maintainer.php` and `config/dev_maintainer_secrets.php` overrides are never collected into the PHAR, even when they exist in the source checkout. The package test suite also opens the committed build and rejects local configuration paths or common credential signatures before release.

Laravel Zero temporarily changes the application environment to `production` while compiling the PHAR. Maintainer uses that native environment switch to disable `app.user_config_prefix`; built executions consequently read and publish the consuming project's unprefixed `config/maintainer.php` and `config/maintainer_secrets.php`. No source configuration files are renamed during the build.

Laravel Zero can load an environment file placed beside the PHAR. Maintainer additionally loads the consuming Composer project's root `.env` before evaluating its own user configuration so `vendor/bin/maintainer` follows the environment conventions of the project it is maintaining. Existing process variables are not overwritten.

## Contribution conventions

Contributions must include automated tests for observable behavior and keep documentation synchronized with changed commands.

Prefer native PHP attributes whenever the framework or library provides an attribute equivalent to legacy metadata properties or configuration. Console commands should use Laravel's `Signature` and `Description` attributes instead of the `$signature` and `$description` properties. Use a legacy form only when no compatible attribute exists.

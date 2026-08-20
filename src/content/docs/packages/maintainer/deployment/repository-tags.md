---
title: Repository Tag Selection
description: Select recent semantic Git tags before a Deployer release is prepared.
sidebar:
  order: 3
---

The contribution recipe exposes the opt-in `repository:tag` task. Attach it before deployment when operators should choose a tag interactively:

```php
set('repository', 'git@github.com:owner/project.git');
set('branch', '2.x');

before('deploy', 'repository:tag');
```

The task queries `git ls-remote --tags --refs`, removes duplicate names, and orders semantic versions newest-first. For the same version line, stable tags appear before beta and alpha prereleases.

When `branch` or the `--branch` option exactly matches `N.x`, only that major is displayed. Other branch formats show tags from every major.

## Limit the choices

The prompt shows the 10 newest matching tags by default:

```php
set('repository_tag_limit', 20);
```

The selected tag becomes the branch and resolved target for the current host.

## Automated deployments

Supplying `--tag` causes `repository:tag` to return without querying or prompting:

```bash
vendor/bin/maintainer deploy production --tag=v2.1.0
```

Without an explicit tag, the task requires an interactive terminal. Do not attach it to unattended deployment flows that provide neither input nor `--tag`.

---
title: Run a Deployment
description: Configure and run the consuming project's Deployer through Maintainer.
sidebar:
  order: 1
---

## Requirements

Install Maintainer or Deployer as a Composer development dependency in the consuming project, then publish `deploy.php` through [Configuration Publishing](/packages/maintainer/configuration/publishing/).

The project recipe owns its repository, hosts, deployment path, shared files, and hooks. It imports the package-managed contribution recipe through the `MAINTAINER_CONTRIB` path supplied by Maintainer.

## Run the deployment

```bash
vendor/bin/maintainer deploy
```

Pass host selectors and options using Deployer's conventions:

```bash
vendor/bin/maintainer deploy production --tag=v1.2.3
vendor/bin/maintainer deploy 'stage=production&role=web' --branch=1.x --limit=2
vendor/bin/maintainer deploy production --option=keep_releases=3 --plan
```

Maintainer resolves the consuming project's `vendor/bin/dep`, runs it from the project root, and returns Deployer's original exit code. Interactive executions retain terminal access for Deployer prompts; non-interactive executions stream standard output and error.

Supported pass-through options are `--file`, `--tag`, `--revision`, `--branch`, repeatable `--option`, `--limit`, `--no-hooks`, `--plan`, `--start-from`, `--log`, and `--profile`.

## Shared contribution recipe

The published recipe imports the absolute contribution path provided through `MAINTAINER_CONTRIB`. This keeps project configuration local while allowing Maintainer updates to add or improve reusable Deployer tasks.

A direct `vendor/bin/dep` invocation must provide `MAINTAINER_CONTRIB` itself and does not receive Maintainer's temporary SSH identity lifecycle. Prefer `vendor/bin/maintainer deploy` for the integrated flow.

## SSH identity

When Maintainer secrets contain an encrypted `ssh_key`, the command decrypts it into a temporary identity file immediately before starting Deployer. POSIX files use mode `0600`; only the path is passed to the child process, and the file is deleted after success, failure, or a process exception.

The contribution recipe configures the path as Deployer's global `identity_file` while recipes are imported, before any task connects. This applies to deployment hooks, granular tasks, `--no-hooks`, and `--start-from`. A host-level `identity_file` configured after the contribution import may override it.

When no generated key exists, Maintainer creates no temporary file and leaves SSH agent, SSH config, and Deployer identity resolution unchanged.

## Extend the deployment

The contribution recipe exposes opt-in tasks rather than attaching project-specific behavior automatically:

- [Repository tag selection](/packages/maintainer/deployment/repository-tags/) with `repository:tag`;
- [PM2 configuration](/packages/maintainer/deployment/pm2/) with `pm2:config`.

Attach them from the project's `deploy.php` at the points appropriate for that application.

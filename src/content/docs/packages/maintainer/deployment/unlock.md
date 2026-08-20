---
title: Unlock a Deployment
description: Invoke Deployer's native unlock task with Maintainer's SSH identity lifecycle.
sidebar:
  order: 2
---

A failed deployment can leave `.dep/deploy.lock` on the remote host. Remove it with Deployer's native task without starting another deployment:

```bash
vendor/bin/maintainer deploy:unlock production
```

The command accepts host selectors and the `--file`, repeatable `--option`, `--limit`, `--no-hooks`, `--plan`, `--log`, and `--profile` options. It returns Deployer's original exit code.

## SSH authentication

Unlock uses the same [temporary Maintainer identity](/packages/maintainer/deployment/deploy/#ssh-identity) as a regular deployment. The identity is configured while the contribution recipe is imported, so `deploy:unlock` can connect even though it does not execute the main `deploy` task or its hooks.

An SSH error such as `Permission denied (publickey)` means the selected identity is not authorized for the remote user or a project/host `identity_file` override points elsewhere. Confirm the public key, remote user, host configuration, and file ownership before retrying.

The same import-time identity behavior applies when Deployer invokes lock inspection, rollback, release listing, logs, push, or another granular remote task through Maintainer.

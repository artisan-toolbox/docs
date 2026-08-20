---
title: Commands and Workflows
description: Find each Maintainer command in its CI, Configuration, Deployment, or Versioning group.
sidebar:
  hidden: true
---

Maintainer commands are documented with their setup and configuration under the same four groups shown in the interactive menu.

## CI

- [`quality`](/packages/maintainer/ci/quality/): run Pint, Rector, PHPStan, Pest, or a selected subset.

## Configuration

- [`config:publish`](/packages/maintainer/configuration/publishing/): publish Maintainer, quality, testing, and deployment templates.
- [`ssh:key` and `ssh:public`](/packages/maintainer/configuration/ssh-keys/): display the encrypted Maintainer identity.
- [Configuration reference](/packages/maintainer/configuration/reference/): configure defaults, secrets, environment variables, encryption, and AI providers.

## Deployment

- [`deploy`](/packages/maintainer/deployment/deploy/): run the consuming project's Deployer binary.
- [`deploy:unlock`](/packages/maintainer/deployment/unlock/): unlock a failed deployment.
- [`repository:tag`](/packages/maintainer/deployment/repository-tags/): select a semantic repository tag.
- [`pm2:config`](/packages/maintainer/deployment/pm2/): replace PM2 processes from an ecosystem file.

## Versioning

- [`commit`](/packages/maintainer/versioning/commits/): select files and create a commit.
- [`diff:html`](/packages/maintainer/versioning/html-diffs/): render a Git comparison in the browser.
- [`release:create`](/packages/maintainer/versioning/releases/): prepare and publish a GitHub release.
- [Project integration](/packages/maintainer/versioning/project-integration/): configure the version class, hooks, and README badge.

## Interactive menu

Open the grouped menu with:

```bash
vendor/bin/maintainer
```

Press `Ctrl+C` inside a submenu to return to **Main Menu**. Choose **Exit** from the main menu to close Maintainer. Compatible terminals are cleared before the banner and breadcrumb are redrawn; unsupported terminals continue without clearing.

The menu requires interactive input. Invoke the individual commands directly in automation and continuous integration.

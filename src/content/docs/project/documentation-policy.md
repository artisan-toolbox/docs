---
title: Documentation Policy
description: Understand how documentation is owned, organized, and kept current.
sidebar:
  order: 1
---

This repository is the source of truth for complete, user-facing Artisan Toolbox documentation.

## Package repositories

Each package repository keeps a concise README containing:

- the package purpose;
- the installation command;
- a minimal usage example;
- compatibility and stability information;
- links to this documentation, contribution guidance, security policy, changelog, and license.

Detailed guides, configuration references, troubleshooting information, and architectural explanations belong here. This separation keeps package landing pages useful without forcing maintainers to update the same long-form content twice.

The canonical public documentation URL is `https://artisantoolbox.wsssoftware.com.br`. Each package README must link to its corresponding page under this URL.

### Package overviews

Start each package overview with its purpose, stability, and documented version. Follow with requirements, installation, a minimal example with an expected result, and links to detailed guides. For packages in development, describe the checkout and label examples as previews.

Maintain the package name, summary, status, and guide navigation in [the site catalog](https://github.com/artisan-toolbox/docs/blob/main/src/packages.mjs). The home page, package catalog, package chooser, and sidebar use that list.

### README badges

Use the Shields.io `flat-square` style and keep badges in this order: Release, PHP, Laravel, Node.js, Tests, and Docs. Use the GitHub release badge for published packages and an `in development` badge before the first release.

Show PHP and Laravel when they apply to the installation. Show Node.js when the package documents a supported frontend version range. Match the version constraints in the package manifests and keep all supported ranges visible. Point Tests to the package's GitHub Actions workflow and Docs to the package's canonical documentation page.

Update the badges in the package's `readmeHead()` method and run `php vendor/bin/maintainer readme:update` from its checkout. In the Maintainer source checkout, run `php maintainer readme:update`.

## Frontend installation guides

Document how to install Artisan Toolbox JavaScript packages from their Composer-installed directories using `file:vendor/artisan-toolbox/<package>` dependencies. Run Composer before the frontend package manager. Explain whether the application builds the source or imports an existing build.

## Language

Community-facing documentation is written in clear, inclusive English. Additional translations may be introduced later without changing the English source documentation.

## Keeping documentation current

Every package task must inspect and update the relevant content in this repository as part of the same change. This includes public features, bug fixes, commands, configuration, compatibility, workflows, extension points, architectural decisions, deprecations, migrations, and breaking changes.

Before a package task is complete, its documentation must accurately describe current behavior, examples, requirements, stability, and compatibility. Pull requests to this repository must pass content validation, formatting, and the production build.

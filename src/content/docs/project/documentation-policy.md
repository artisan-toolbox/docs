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

## Language

Community-facing documentation is written in clear, inclusive English. Additional translations may be introduced later without changing the English source documentation.

## Keeping documentation current

Every package task must inspect and update the relevant content in this repository as part of the same change. This includes public features, bug fixes, commands, configuration, compatibility, workflows, extension points, architectural decisions, deprecations, migrations, and breaking changes.

Before a package task is complete, its documentation must accurately describe current behavior, examples, requirements, stability, and compatibility. Pull requests to this repository must pass content validation, formatting, and the production build.

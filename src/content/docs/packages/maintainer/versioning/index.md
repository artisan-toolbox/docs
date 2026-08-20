---
title: Versioning
description: Review changes, create commits, and publish versioned GitHub releases.
sidebar:
  order: 4
---

The Versioning group turns a reviewed working tree into commits and releases while keeping Git as the source of truth.

- [Create commits](./commits/): select files and write or generate Conventional Commit messages.
- [HTML Git diffs](./html-diffs/): review working-tree or reference comparisons in a browser.
- [Create releases](./releases/): select a semantic version, generate release content, push, and publish through GitHub CLI.
- [Project integration](./project-integration/): expose the version class, lifecycle hooks, and managed README badge.

Every mutating workflow starts from the consuming Composer project's root, even when Maintainer is invoked from a subdirectory.

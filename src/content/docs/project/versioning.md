---
title: Versioning
description: Learn how the documentation site and package documentation are versioned.
sidebar:
  order: 2
---

The documentation site and the packages it documents have independent release histories.

## Documentation site

The site follows [Semantic Versioning](https://semver.org/). Its current version is stored in the root `package.json` file.

- Patch releases correct or clarify existing documentation.
- Minor releases add package documentation, guides, or site capabilities without removing established URLs.
- Major releases may reorganize public URLs or remove documentation for unsupported package generations.

Git tags use the `vMAJOR.MINOR.PATCH` format, such as `v0.1.0`.

## Package documentation

Every package follows its own version and compatibility policy. The badge beside a package in the navigation identifies the documented major generation.

The unversioned package URL, such as `/packages/core/`, documents the latest supported release. When a new major version requires substantially different documentation, the previous generation is preserved under a versioned URL before the unversioned page moves forward.

Documentation-only releases do not change any package version.

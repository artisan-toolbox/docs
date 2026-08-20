---
title: Project Integration
description: Integrate project-specific versioning hooks and README version badges with Maintainer.
sidebar:
  order: 4
---

Maintainer exports lightweight PHP contracts through the consuming project's Composer autoloader. Project-specific integrations can implement these contracts without loading the Laravel Zero runtime used by the PHAR:

```php
<?php

namespace App;

use ArtisanToolbox\Maintainer\Versionable\Contracts\AfterVersioning;
use ArtisanToolbox\Maintainer\Versionable\Contracts\BeforeVersioning;
use ArtisanToolbox\Maintainer\Versionable\Contracts\Versionable;
use ArtisanToolbox\Maintainer\Versionable\Contracts\WithReadmeBadgeVersion;

final class ApplicationVersion implements Versionable, BeforeVersioning, AfterVersioning, WithReadmeBadgeVersion
{
    public const string VERSION = '1.0.0';

    public static function beforeVersioning(string $current, string $next): void
    {
        // Prepare project-specific files for the selected version transition.
    }

    public static function afterVersioning(string $current, string $next): void
    {
        // Run project-specific follow-up after GitHub publishes the release.
    }
}
```

## Version class

The version class must live directly in a production PSR-4 namespace declared under `autoload.psr-4` in the project's `composer.json`. Classes in nested namespaces and development-only PSR-4 mappings are not considered.

Declaring `public const string VERSION` is optional: Maintainer creates it when absent and updates it when present. Existing constants must be public, string-typed, and use `MAJOR.MINOR.PATCH`, optionally followed by `-alpha`, `-alpha.N`, `-beta`, or `-beta.N`. Other formats, including `v` prefixes, release candidates, build metadata, missing components, and leading zeros, are rejected.

When the class has no version constant, the current version falls back to the latest valid GitHub release and then to `MAJOR.0.0`.

## Versioning hooks

`BeforeVersioning::beforeVersioning($current, $next)` runs immediately after Maintainer writes the selected version and before it generates the remaining release files. Files changed by this callback become part of the release commit. If it or another pre-push step fails, Maintainer resets the repository to the original `HEAD` and removes untracked release files.

`AfterVersioning::afterVersioning($current, $next)` runs only after the release commit is pushed and the GitHub release is published. Remote work cannot be rolled back automatically at this stage.

Both callbacks run inside a visible terminal spinner and receive the same transition: the previous version and the selected version.

## README version badge

`WithReadmeBadgeVersion` is a marker contract. When present, Maintainer inserts or updates this protected block near the top of `README.md`:

```html
<!-- MAINTAINER:VERSION_BADGE:START - Managed by Maintainer. User agents must not edit this section. -->
<a href="VERSION"
  ><img
    src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square"
    alt="version"
/></a>
<!-- MAINTAINER:VERSION_BADGE:END -->
```

The markers are stable and must not be edited manually. Maintainer preserves HTML or Markdown from an existing managed block. When inserting one for the first time, it follows the first Shields.io badge found outside code fences and falls back to Markdown when no badge style exists.

Because Maintainer is normally installed as a development dependency, project integrations should also be development-only. If production code implements a Maintainer contract, install the package as a regular dependency so the interface remains available after `composer install --no-dev`.

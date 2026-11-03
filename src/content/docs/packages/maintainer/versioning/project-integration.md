---
title: Project Integration
description: Integrate project-specific versioning hooks and README version badges with Maintainer.
sidebar:
  order: 4
---

Maintainer explicitly maps its lightweight `ArtisanToolbox\Maintainer\Versionable\Contracts` namespace through the consuming project's Composer autoloader. Project-specific integrations can implement these contracts without exposing Maintainer's complete `app/` directory or loading the Laravel Zero runtime used by the PHAR:

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

The version class must either live directly in a production PSR-4 namespace declared under `autoload.psr-4` or be included by a production `autoload.classmap` entry in the project's `composer.json`. Classes in nested PSR-4 namespaces and development-only autoload mappings are not considered. Classmap entries may point to a PHP file or a directory; directories are inspected recursively.

Declaring `public const string VERSION` is optional: Maintainer creates it when absent and updates it when present. Existing constants must be public, string-typed, and use `MAJOR.MINOR.PATCH`, optionally followed by `-alpha`, `-alpha.N`, `-beta`, or `-beta.N`. Other formats, including `v` prefixes, release candidates, build metadata, missing components, and leading zeros, are rejected.

When the class has no version constant, the current version falls back to the latest valid GitHub release and then to `MAJOR.0.0`.

## Versioning hooks

`BeforeVersioning::beforeVersioning($current, $next)` runs immediately after Maintainer writes the selected version and before it generates the remaining release files. Files changed by this callback become part of the release commit. If it or another pre-push step fails, Maintainer resets the repository to the original `HEAD` and removes untracked release files.

`AfterVersioning::afterVersioning($current, $next)` runs only after the release commit is pushed and the GitHub release is published. Remote work cannot be rolled back automatically at this stage.

Both callbacks run inside a visible terminal spinner and receive the same transition: the previous version and the selected version.

## README version badge

When the versionable class implements `WithReadmeBadgeVersion`, Maintainer inserts or updates a version badge in `README.md`:

```markdown
[![version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](VERSION "MAINTAINER_VERSION")
```

Keep the `MAINTAINER_VERSION` link title on the badge. Maintainer uses it to locate the badge and keeps the link pointed at the `VERSION` file. The badge stays on one line, so it can sit next to other badges in the same Markdown paragraph. HTML badges use the same marker as a `title` attribute on the link.

Maintainer converts existing comment-delimited badges in place and preserves their HTML or Markdown format. On first insertion, it follows the first Shields.io badge outside code fences and defaults to Markdown if there are no such badges.

Because Maintainer is normally installed as a development dependency, project integrations should also be development-only. If production code implements a Maintainer contract, install the package as a regular dependency so the interface remains available after `composer install --no-dev`.

---
title: Project Integration
description: Integrate versioning hooks, managed README headers, and version badges with Maintainer.
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

final class ApplicationVersion implements Versionable, BeforeVersioning, AfterVersioning
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

During `release:create`, if the class has no version constant, the current version falls back to the latest valid GitHub release and then to `MAJOR.0.0`.

## Versioning hooks

`BeforeVersioning::beforeVersioning($current, $next)` runs after Maintainer writes the PHP version constant and applies any confirmed `package.json` version update. Files changed by this callback become part of the release commit. If it or another pre-push step fails, Maintainer resets the repository to the original `HEAD` and removes untracked release files.

`AfterVersioning::afterVersioning($current, $next)` runs only after the release commit is pushed and the GitHub release is published. Remote work cannot be rolled back automatically at this stage.

Both callbacks run inside a visible terminal spinner and receive the same transition: the previous version and the selected version.

## Managed README header

Implement `WithReadmeHead` on the class that implements `Versionable` to generate the README header during `release:create`. Use a class that Maintainer can instantiate without constructor arguments.

```php
<?php

namespace App;

use ArtisanToolbox\Maintainer\Versionable\Contracts\Versionable;
use ArtisanToolbox\Maintainer\Versionable\Contracts\WithReadmeHead;
use ArtisanToolbox\Maintainer\Versionable\Readme\Badge;
use ArtisanToolbox\Maintainer\Versionable\Readme\Head;

final class ApplicationVersion implements Versionable, WithReadmeHead
{
    public const string VERSION = '1.0.0';

    public function readmeHead(): Head
    {
        return (new Head)
            ->withLogo(src: 'assets/logo.svg', alt: 'Example logo', width: 96)
            ->withTitle('Example')
            ->withDescription([
                '**Release tools** for Laravel projects.',
                'Run `vendor/bin/maintainer` to open the menu.',
            ])
            ->appendDescriptionLine('See the [release notes](https://github.com/acme/example/releases).')
            ->addBadge(Badge::releaseVersion('https://github.com/acme/example/releases'))
            ->addBadge(Badge::make(
                link: 'https://packagist.org/packages/acme/example',
                imgSrc: 'https://img.shields.io/packagist/v/acme/example',
                imgAlt: 'Packagist',
            ));
    }
}
```

Composer autoloads the contract and both objects in the consuming project. The method returns an instance of `Head`. The builder methods in the example return the same instance for chaining.

The title, badge row, and description are optional. Maintainer renders each provided section as centered HTML, in that order. The section IDs are `maintainer-title`, `maintainer-badges`, and `maintainer-description`. The badge row follows the order of the `addBadge()` calls. `Badge::make()` requires `link` and `imgSrc`. Optional arguments are `imgAlt` on the image and `title` and `id` on the link. Pass plain text and unescaped URLs for the title and badges. Maintainer escapes those values when it renders the HTML.

Use `withDescription()` with a string for one paragraph or an array of strings for several. Each call replaces the current description. Pass `null` or an empty array to clear it. Call `appendDescriptionLine()` to add a paragraph at the end.

Pass inline Markdown directly to either method. Maintainer renders bold, emphasis, inline code, and links, escapes raw HTML, and blocks unsafe link destinations. It skips blank entries and puts the `maintainer-description` ID on the first rendered paragraph.

A blank line within a string stays within the same paragraph. Use a separate array entry or call `appendDescriptionLine()` to start another paragraph.

`descriptionLines()` returns the stored strings in order. `description()` returns them joined by blank lines, or `null` when there are no entries.

Use `withLogo($src, $alt, $width = 160)` to place an optional image above the title. The logo can also appear without a title. Set `src` to a non-blank URL or a path relative to `README.md`. Use an empty `alt` for a decorative logo. Set `width` to a positive integer in pixels. Maintainer sets the HTML image width and lets the renderer calculate the height from the aspect ratio. The width is a display size and can enlarge a smaller image.

Use `Badge::releaseVersion($link)` to display the version selected in `release:create`. Set `$link` to the destination for the badge, such as the project's releases page. If you read the image URL of this badge directly, pass the version to `imgSrc($version)`.

To take over an existing header, place these comments on their own lines around the content that Maintainer can replace.

```html
<!-- MAINTAINER:README_HEAD:START -->
<!-- MAINTAINER:README_HEAD:END -->
```

Maintainer replaces the header inside the pair and preserves the README text outside it. If a section is absent from the returned `Head`, Maintainer removes that section from the generated header. It keeps the marker pair in place when the head becomes empty. For a README without markers, the first non-empty head is inserted at the top.

Keep exactly one complete marker pair outside code fences. Maintainer rejects incomplete, reversed, or duplicate markers before it writes the file.

### Update the README locally

To test changes to `readmeHead()`, choose **Versioning → Update README header** from the Maintainer menu. You can also run the command directly.

```bash
vendor/bin/maintainer readme:update
```

Run the command from a Composer project with an existing `README.md` and a version class that implements `WithReadmeHead`. Maintainer writes the managed header and reports whether it changed. The command accepts a dirty working tree so you can check the result before committing.

A badge created with `Badge::releaseVersion()` requires a valid `VERSION` constant for a local update. The command reads that constant directly. A head without version badges can render before the class declares a version.

This workflow updates the README without running the release hooks or creating a GitHub release. In the Maintainer source checkout, run `php maintainer readme:update`.

## Migrate an existing version badge

<a id="readme-version-badge"></a>

Maintainer 1.9 replaced `WithReadmeBadgeVersion` with `WithReadmeHead`. If you use the old contract on Maintainer 1.8 or earlier, update the version class and dependency together. A class that implements the removed interface fails to load on 1.9 and later.

1. Replace the old interface with `WithReadmeHead` on the version class.
2. Implement `readmeHead()` and add `Badge::releaseVersion($link)` to its returned `Head`. Include any other badges you want in the generated row. The example on this page uses the description builder added in 1.10.
3. Replace the old `MAINTAINER_VERSION` badge with the new header marker pair. To replace an existing header or badge row in place, put the pair around that block.
4. Run `vendor/bin/maintainer readme:update` and review the resulting README before committing.

Because Maintainer is normally installed as a development dependency, project integrations should also be development-only. If production code implements a Maintainer contract, install the package as a regular dependency so the interface remains available after `composer install --no-dev`.

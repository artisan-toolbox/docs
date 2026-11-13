<?php

declare(strict_types=1);

namespace App;

use ArtisanToolbox\Maintainer\Versionable\Contracts\Versionable;
use ArtisanToolbox\Maintainer\Versionable\Contracts\WithReadmeHead;
use ArtisanToolbox\Maintainer\Versionable\Readme\Badge;
use ArtisanToolbox\Maintainer\Versionable\Readme\Head;

final class ArtisanToolbox implements Versionable, WithReadmeHead
{
    public const string VERSION = '1.2.0';

    public function readmeHead(): Head
    {
        return (new Head)
            ->withLogo(src: 'public/images/brand/artisan-toolbox-icon.png', alt: 'Artisan Toolbox', width: 88)
            ->withTitle('Artisan Toolbox documentation')
            ->withDescription([
                'A Laravel, Vue, and Inertia application for Artisan Toolbox documentation and package integration examples.',
                'The application is under migration. The existing documentation remains published at [atb.dev.br](https://atb.dev.br).',
            ])
            ->addBadge(Badge::make(
                link: 'https://github.com/artisan-toolbox/docs/releases',
                imgSrc: 'https://img.shields.io/badge/Release-in%20development-lightgrey?style=flat-square',
                imgAlt: 'Release',
            ))
            ->addBadge(Badge::make(
                link: 'https://github.com/artisan-toolbox/docs/blob/1.x/README.md',
                imgSrc: 'https://img.shields.io/badge/PHP-%5E8.5-777BB4?style=flat-square',
                imgAlt: 'PHP',
            ))
            ->addBadge(Badge::make(
                link: 'https://github.com/artisan-toolbox/docs/blob/1.x/README.md',
                imgSrc: 'https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square',
                imgAlt: 'Laravel',
            ))
            ->addBadge(Badge::make(
                link: 'https://github.com/artisan-toolbox/docs/actions/workflows/tests.yml?query=branch%3A1.x',
                imgSrc: 'https://img.shields.io/github/actions/workflow/status/artisan-toolbox/docs/tests.yml?branch=1.x&label=Tests&style=flat-square',
                imgAlt: 'Tests',
            ))
            ->addBadge(Badge::make(
                link: 'https://atb.dev.br',
                imgSrc: 'https://img.shields.io/badge/Docs-Read-blue?style=flat-square',
                imgAlt: 'Docs',
            ));
    }
}

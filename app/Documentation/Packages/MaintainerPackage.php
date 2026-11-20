<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class MaintainerPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'maintainer',
            title: 'Maintainer',
            summary: 'Run quality checks, create releases, and automate project maintenance.',
            version: '1.x',
            overview: PageSlug::Maintainer,
            documentedVersion: '1.14.4',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 minimum within PHP 8.x (tested on PHP 8.5 and 8.6)',
                'Composer',
                'Git',
                'GitHub CLI for workflows that interact with GitHub',
            ],
        );
    }
}

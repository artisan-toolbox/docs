<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerPage extends Page
{
    public const PageSlug SLUG = PageSlug::Maintainer;

    public function __construct()
    {
        $package = new MaintainerPackage;

        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Maintainer',
            title: $package->title,
            description: 'Automated validation, quality assurance, versioning, and release workflows.',
            sourcePath: 'src/content/docs/packages/maintainer/index.md',
            package: $package,
        );
    }
}

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
            sourcePath: 'resources/js/pages/docs/maintainer/Maintainer.vue',
            package: $package,
        );
    }
}

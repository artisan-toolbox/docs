<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerVersioningPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerVersioning;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/versioning/Index',
            title: 'Versioning',
            description: 'Review changes, create commits, and publish versioned GitHub releases.',
            sourcePath: 'resources/js/pages/docs/maintainer/versioning/Index.vue',
            package: new MaintainerPackage,
        );
    }
}

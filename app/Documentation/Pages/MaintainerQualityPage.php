<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerQualityPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerQuality;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Quality',
            title: 'Fixes and CI Checks',
            description: 'Apply automated fixes and run configured PHP and frontend quality checks.',
            sourcePath: 'resources/js/pages/docs/maintainer/Quality.vue',
            package: new MaintainerPackage,
        );
    }
}

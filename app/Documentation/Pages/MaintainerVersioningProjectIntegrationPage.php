<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerVersioningProjectIntegrationPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerVersioningProjectIntegration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/versioning/ProjectIntegration',
            title: 'Project Integration',
            description: 'Integrate versioning hooks, managed README headers, and version badges with Maintainer.',
            sourcePath: 'resources/js/pages/docs/maintainer/versioning/ProjectIntegration.vue',
            package: new MaintainerPackage,
        );
    }
}

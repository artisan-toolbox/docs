<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDeploymentPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDeployment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/deployment/Index',
            title: 'Deployment',
            description: 'Run Deployer with Maintainer\'s project recipe, SSH identity, and reusable tasks.',
            sourcePath: 'resources/js/pages/docs/maintainer/deployment/Index.vue',
            package: new MaintainerPackage,
        );
    }
}

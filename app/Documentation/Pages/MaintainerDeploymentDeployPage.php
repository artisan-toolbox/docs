<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDeploymentDeployPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDeploymentDeploy;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/deployment/Deploy',
            title: 'Run a Deployment',
            description: 'Configure and run the consuming project\'s Deployer through Maintainer.',
            sourcePath: 'resources/js/pages/docs/maintainer/deployment/Deploy.vue',
            package: new MaintainerPackage,
        );
    }
}

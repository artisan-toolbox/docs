<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDeploymentUnlockPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDeploymentUnlock;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/deployment/Unlock',
            title: 'Unlock a Deployment',
            description: 'Invoke Deployer\'s native unlock task with Maintainer\'s SSH identity lifecycle.',
            sourcePath: 'resources/js/pages/docs/maintainer/deployment/Unlock.vue',
            package: new MaintainerPackage,
        );
    }
}

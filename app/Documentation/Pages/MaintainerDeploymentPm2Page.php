<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDeploymentPm2Page extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDeploymentPm2;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/deployment/Pm2',
            title: 'PM2 Configuration',
            description: 'Replace and persist application processes by PM2 namespace from an ecosystem file.',
            sourcePath: 'resources/js/pages/docs/maintainer/deployment/Pm2.vue',
            package: new MaintainerPackage,
        );
    }
}

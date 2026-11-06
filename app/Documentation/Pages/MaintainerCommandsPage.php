<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerCommandsPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerCommands;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Commands',
            title: 'Commands and Workflows',
            description: 'Find each Maintainer command in its Code Quality, Configuration, Deployment, or Versioning group.',
            sourcePath: 'resources/js/pages/docs/maintainer/Commands.vue',
            package: new MaintainerPackage,
        );
    }
}

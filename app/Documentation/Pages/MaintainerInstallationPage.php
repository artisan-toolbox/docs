<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Installation',
            title: 'Install Maintainer',
            description: 'Install the isolated CLI and verify the available commands before configuring a project.',
            sourcePath: 'resources/js/pages/docs/maintainer/Installation.vue',
            package: new MaintainerPackage,
        );
    }
}

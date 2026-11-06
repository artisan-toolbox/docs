<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerConfigurationPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerConfiguration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/configuration/Index',
            title: 'Configuration',
            description: 'Publish project templates and manage Maintainer settings, secrets, and SSH keys.',
            sourcePath: 'resources/js/pages/docs/maintainer/configuration/Index.vue',
            package: new MaintainerPackage,
        );
    }
}

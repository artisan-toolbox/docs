<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Installation',
            title: 'Install the Dapter preview',
            description: 'Install a local Dapter checkout through Composer, connect the Vue and Ziggy frontend, and prepare the first source listing.',
            sourcePath: 'resources/js/pages/docs/dapter/Installation.vue',
            package: new DapterPackage,
        );
    }
}

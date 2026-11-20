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
            title: 'Install Dapter',
            description: 'Install Dapter 1.0.0-beta.3 with Composer, connect Vue and Ziggy, and read your first page of notebooks.',
            sourcePath: 'resources/js/pages/docs/dapter/Installation.vue',
            package: new DapterPackage,
        );
    }
}

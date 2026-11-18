<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterVueNavigationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterVueNavigation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/VueNavigation',
            title: 'Save catalog navigation in the URL',
            description: 'Restore independent source-bound state and scroll only the declared region.',
            sourcePath: 'resources/js/pages/docs/dapter/VueNavigation.vue',
            package: new DapterPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeNavigationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeNavigation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Navigation',
            title: 'Navigation',
            description: 'Move between destinations and content sections.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Navigation.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeComponentsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeComponents;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Index',
            title: 'Vue components',
            description: 'Browse Web Awesome component groups and Front Awesome Vue wrapper availability.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Index.vue',
            package: new FrontAwesomePackage,
        );
    }
}

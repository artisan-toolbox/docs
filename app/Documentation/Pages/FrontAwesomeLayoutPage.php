<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeLayoutPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeLayout;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Layout',
            title: 'Layout',
            description: 'Arrange content and application regions.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Layout.vue',
            package: new FrontAwesomePackage,
        );
    }
}

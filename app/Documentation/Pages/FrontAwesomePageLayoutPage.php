<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePageLayoutPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePageLayout;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Page',
            title: 'Build a page layout',
            description: 'Use wa-page with Tailwind while preserving upstream layout, responsive navigation, and slot spacing.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Page.vue',
            package: new FrontAwesomePackage,
        );
    }
}

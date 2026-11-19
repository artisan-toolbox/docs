<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeScrollbarPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeScrollbar;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Scrollbar',
            title: 'Style a scrollbar',
            description: 'Try the Front Awesome scrollbar colors, auto-hide, and track clicks in light and dark mode.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Scrollbar.vue',
            package: new FrontAwesomePackage,
        );
    }
}

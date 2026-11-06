<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeWebAwesomePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeWebAwesome;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/WebAwesome',
            title: 'Web Awesome setup',
            description: 'Configure Vite, use your application\'s theme, and select Web Awesome Core or Pro.',
            sourcePath: 'resources/js/pages/docs/front-awesome/WebAwesome.vue',
            package: new FrontAwesomePackage,
        );
    }
}

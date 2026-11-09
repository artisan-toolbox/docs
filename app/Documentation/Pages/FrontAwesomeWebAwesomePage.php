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
            title: 'Web Awesome',
            description: 'Configure Web Awesome, browse Vue wrappers, and build application layouts.',
            sourcePath: 'resources/js/pages/docs/front-awesome/WebAwesome.vue',
            package: new FrontAwesomePackage,
        );
    }
}

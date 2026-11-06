<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesome;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Index',
            title: 'Front Awesome',
            description: 'Use Vue components, manage color mode, and send toast notifications in Laravel applications with Inertia.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Index.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeButtonPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeButton;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Button',
            title: 'Buttons and button groups',
            description: 'Render Web Awesome buttons and button groups with typed Vue wrappers.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Button.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeIconPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeIcon;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Icon',
            title: 'Render icons with Web Awesome',
            description: 'Use the Vue Icon with native Web Awesome attributes, accessible labels, and typed load events.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Icon.vue',
            package: new FrontAwesomePackage,
        );
    }
}

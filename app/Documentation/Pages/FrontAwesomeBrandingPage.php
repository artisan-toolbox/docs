<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeBrandingPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeBranding;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Branding',
            title: 'Customize branding',
            description: 'Change shared Tailwind inputs and understand Web Awesome scope, contrast, and shadow limits.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Branding.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeStylingPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeStyling;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Styling',
            title: 'Appearance and branding',
            description: 'Choose a shared theme, customize branding, and review optional styling integrations.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Styling.vue',
            package: new FrontAwesomePackage,
        );
    }
}

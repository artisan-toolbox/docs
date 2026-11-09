<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeHelpersPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeHelpers;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Helpers',
            title: 'Helpers',
            description: 'Format values and coordinate browser behavior.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Helpers.vue',
            package: new FrontAwesomePackage,
        );
    }
}

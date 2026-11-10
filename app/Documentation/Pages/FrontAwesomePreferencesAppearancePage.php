<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesAppearancePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferencesAppearance;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/preferences/Appearance',
            title: 'Appearance',
            description: 'Build a renderless appearance selector that saves system, light, or dark mode.',
            sourcePath: 'resources/js/pages/docs/front-awesome/preferences/Appearance.vue',
            package: new FrontAwesomePackage,
        );
    }
}

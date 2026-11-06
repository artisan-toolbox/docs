<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeThemeMaintenancePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeThemeMaintenance;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/ThemeMaintenance',
            title: 'Maintain the shared theme',
            description: 'Track theme ownership and validate upstream Tailwind, Web Awesome, and PrimeVue updates.',
            sourcePath: 'resources/js/pages/docs/front-awesome/ThemeMaintenance.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesTimezonePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferencesTimezone;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/preferences/Timezone',
            title: 'Timezone',
            description: 'Save a display timezone and format browser and Carbon dates without changing their instant.',
            sourcePath: 'resources/js/pages/docs/front-awesome/preferences/Timezone.vue',
            package: new FrontAwesomePackage,
        );
    }
}

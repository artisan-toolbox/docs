<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferences;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Preferences',
            title: 'Persist display preferences',
            description: 'Save appearance, language, and display timezone through Laravel sessions or an authenticated user.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Preferences.vue',
            package: new FrontAwesomePackage,
        );
    }
}

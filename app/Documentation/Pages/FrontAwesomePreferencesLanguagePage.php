<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesLanguagePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferencesLanguage;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/preferences/Language',
            title: 'Language',
            description: 'Save a supported language and keep Laravel, document language, and translations synchronized.',
            sourcePath: 'resources/js/pages/docs/front-awesome/preferences/Language.vue',
            package: new FrontAwesomePackage,
        );
    }
}

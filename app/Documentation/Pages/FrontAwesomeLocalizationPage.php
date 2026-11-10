<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeLocalizationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeLocalization;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Localization',
            title: 'Translate the browser from Laravel',
            description: 'Export Laravel language files, follow HTML language, and format values through Vue I18n.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Localization.vue',
            package: new FrontAwesomePackage,
        );
    }
}

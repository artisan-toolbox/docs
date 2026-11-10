<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeLocalizationReferencePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeLocalizationReference;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/LocalizationReference',
            title: 'Localization reference',
            description: 'Look up translation export settings, locale ownership, Laravel message syntax, and browser APIs.',
            sourcePath: 'resources/js/pages/docs/front-awesome/LocalizationReference.vue',
            package: new FrontAwesomePackage,
        );
    }
}

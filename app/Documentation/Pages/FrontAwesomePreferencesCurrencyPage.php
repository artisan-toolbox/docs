<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePreferencesCurrencyPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePreferencesCurrency;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/preferences/Currency',
            title: 'Currency preferences',
            description: 'Save an optional ISO 4217 currency and format numbers with Vue I18n.',
            sourcePath: 'resources/js/pages/docs/front-awesome/preferences/Currency.vue',
            package: new FrontAwesomePackage,
        );
    }
}

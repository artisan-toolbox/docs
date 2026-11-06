<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePrimevuePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePrimevue;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Primevue',
            title: 'Style PrimeVue components',
            description: 'Share application branding with the optional official PrimeVue 4 styled preset integration.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Primevue.vue',
            package: new FrontAwesomePackage,
        );
    }
}

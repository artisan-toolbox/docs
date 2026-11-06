<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeToastsVuePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeToastsVue;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/toasts/Vue',
            title: 'Show toasts from Vue',
            description: 'Use the toast composable or global Vue service and configure TypeScript and ESLint.',
            sourcePath: 'resources/js/pages/docs/front-awesome/toasts/Vue.vue',
            package: new FrontAwesomePackage,
        );
    }
}

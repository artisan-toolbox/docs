<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeToastsLaravelPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeToastsLaravel;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/toasts/Laravel',
            title: 'Send toasts from Laravel',
            description: 'Build a toast with the Laravel facade and send it through Inertia flash or Mosaicast.',
            sourcePath: 'resources/js/pages/docs/front-awesome/toasts/Laravel.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeToastsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeToasts;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Toasts',
            title: 'Toasts',
            description: 'Send toast notifications from Laravel actions or Vue components.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Toasts.vue',
            package: new FrontAwesomePackage,
        );
    }
}

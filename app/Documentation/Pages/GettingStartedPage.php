<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class GettingStartedPage extends Page
{
    public const PageSlug SLUG = PageSlug::GettingStarted;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/getting-started/Index',
            title: 'Getting Started',
            description: 'Learn how the Artisan Toolbox documentation and packages are organized.',
            sourcePath: 'resources/js/pages/docs/getting-started/Index.vue',
        );
    }
}

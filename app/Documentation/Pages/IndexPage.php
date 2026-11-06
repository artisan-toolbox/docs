<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class IndexPage extends Page
{
    public const PageSlug SLUG = PageSlug::Index;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/Index',
            title: 'Documentation',
            description: 'Practical guides for Artisan Toolbox Laravel packages and developer tools.',
            sourcePath: 'resources/js/pages/docs/Index.vue',
        );
    }
}

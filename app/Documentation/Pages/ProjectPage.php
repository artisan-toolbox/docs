<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class ProjectPage extends Page
{
    public const PageSlug SLUG = PageSlug::Project;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/project/Index',
            title: 'About the project',
            description: 'Documentation ownership, contribution policies, and release conventions for Artisan Toolbox.',
            sourcePath: 'resources/js/pages/docs/project/Index.vue',
        );
    }
}

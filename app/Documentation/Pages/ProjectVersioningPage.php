<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class ProjectVersioningPage extends Page
{
    public const PageSlug SLUG = PageSlug::ProjectVersioning;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/project/Versioning',
            title: 'Versioning',
            description: 'Learn how the documentation site and package documentation are versioned.',
            sourcePath: 'resources/js/pages/docs/project/Versioning.vue',
        );
    }
}

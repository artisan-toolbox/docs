<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class ProjectDocumentationPolicyPage extends Page
{
    public const PageSlug SLUG = PageSlug::ProjectDocumentationPolicy;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/project/DocumentationPolicy',
            title: 'Documentation Policy',
            description: 'Understand how documentation is owned, organized, and kept current.',
            sourcePath: 'resources/js/pages/docs/project/DocumentationPolicy.vue',
        );
    }
}

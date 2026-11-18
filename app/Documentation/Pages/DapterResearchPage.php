<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterResearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterResearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Research',
            title: 'Research findings',
            description: 'Separate native engine feasibility from deferred Dapter vector retrieval and persisted pagination.',
            sourcePath: 'resources/js/pages/docs/dapter/Research.vue',
            package: new DapterPackage,
        );
    }
}

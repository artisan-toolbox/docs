<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterGlobalFiltersPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterGlobalFilters;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/GlobalFilters', title: 'Apply finite global filters', description: 'Validate finite inputs before trusted handlers run.', sourcePath: 'resources/js/pages/docs/dapter/GlobalFilters.vue', package: new DapterPackage);
    }
}

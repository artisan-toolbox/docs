<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterGlobalSearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterGlobalSearch;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/GlobalSearch', title: 'Search across declared targets', description: 'Compose one global target group with field searches.', sourcePath: 'resources/js/pages/docs/dapter/GlobalSearch.vue', package: new DapterPackage);
    }
}

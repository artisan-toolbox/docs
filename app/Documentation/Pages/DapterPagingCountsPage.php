<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterPagingCountsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterPagingCounts;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/PagingCounts', title: 'Request optional exact counts', description: 'Enable exact counts for simple or cursor reads without inventing numbered or last-page navigation.', sourcePath: 'resources/js/pages/docs/dapter/PagingCounts.vue', package: new DapterPackage);
    }
}

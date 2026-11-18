<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterSimplePagingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterSimplePaging;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/SimplePaging', title: 'Read without exact counts', description: 'Use simple pagination with bounded lookahead, honest unknown totals, and a registered traversal driver.', sourcePath: 'resources/js/pages/docs/dapter/SimplePaging.vue', package: new DapterPackage);
    }
}

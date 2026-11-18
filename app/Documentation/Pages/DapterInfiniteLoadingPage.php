<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterInfiniteLoadingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterInfiniteLoading;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/InfiniteLoading', title: 'Append records vertically', description: 'Accumulate simple and joined offset pages in a guarded vertical window.', sourcePath: 'resources/js/pages/docs/dapter/InfiniteLoading.vue', package: new DapterPackage);
    }
}

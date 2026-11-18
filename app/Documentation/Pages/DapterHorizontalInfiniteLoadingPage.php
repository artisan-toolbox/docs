<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterHorizontalInfiniteLoadingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterHorizontalInfiniteLoading;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/HorizontalInfiniteLoading', title: 'Append cards horizontally', description: 'Observe a horizontal cursor window with an explicit root and trailing sentinel.', sourcePath: 'resources/js/pages/docs/dapter/HorizontalInfiniteLoading.vue', package: new DapterPackage);
    }
}

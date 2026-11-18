<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterCollectionComparisonsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterCollectionComparisons;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/CollectionComparisons',
            title: 'Compare Collection values',
            description: 'Choose verified PHP comparisons and explicit locale ordering without changing literal search.',
            sourcePath: 'resources/js/pages/docs/dapter/CollectionComparisons.vue',
            package: new DapterPackage,
        );
    }
}

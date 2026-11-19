<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterVectorSearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterVectorSearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/VectorSearch',
            title: 'Filter PostgreSQL vectors by distance',
            description: 'Use prepared numeric vectors and an inclusive L2 threshold without changing source ordering.',
            sourcePath: 'resources/js/pages/docs/dapter/VectorSearch.vue',
            package: new DapterPackage,
        );
    }
}

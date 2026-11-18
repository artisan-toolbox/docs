<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterFieldSearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterFieldSearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/FieldSearch',
            title: 'Search data',
            description: 'Add a search input and choose field, cross-field, or full-text search when needed.',
            sourcePath: 'resources/js/pages/docs/dapter/FieldSearch.vue',
            package: new DapterPackage,
        );
    }
}

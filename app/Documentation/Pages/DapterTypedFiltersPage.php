<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterTypedFiltersPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterTypedFilters;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/TypedFilters',
            title: 'Preserve filter value types',
            description: 'Observe null, false, zero, decimal, and string distinctions through real reads.',
            sourcePath: 'resources/js/pages/docs/dapter/TypedFilters.vue',
            package: new DapterPackage,
        );
    }
}

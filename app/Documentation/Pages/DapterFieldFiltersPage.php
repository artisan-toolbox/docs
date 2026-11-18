<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterFieldFiltersPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterFieldFilters;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/FieldFilters',
            title: 'Filter data',
            description: 'Let readers select allowed values and clear filters while preserving mandatory source scope.',
            sourcePath: 'resources/js/pages/docs/dapter/FieldFilters.vue',
            package: new DapterPackage,
        );
    }
}

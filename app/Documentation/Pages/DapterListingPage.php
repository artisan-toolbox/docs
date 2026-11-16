<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterListingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterListing;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Listing',
            title: 'Read and paginate a source',
            description: 'Run the local Dapter preview with Collection and SQLite sources, typed declarations, access checks, and a headless Vue adapter.',
            sourcePath: 'resources/js/pages/docs/dapter/Listing.vue',
            package: new DapterPackage,
        );
    }
}

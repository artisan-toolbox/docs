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
            title: 'Display and paginate data',
            description: 'Render notebook rows and move between numbered pages. Choose simple, cursor, or load-more behavior when needed.',
            sourcePath: 'resources/js/pages/docs/dapter/Listing.vue',
            package: new DapterPackage,
        );
    }
}

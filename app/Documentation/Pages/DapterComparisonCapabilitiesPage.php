<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterComparisonCapabilitiesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterComparisonCapabilities;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/ComparisonCapabilities',
            title: 'Compare source capabilities',
            description: 'Look up admitted comparisons, metadata, unavailable combinations, and regex failure behavior.',
            sourcePath: 'resources/js/pages/docs/dapter/ComparisonCapabilities.vue',
            package: new DapterPackage,
        );
    }
}

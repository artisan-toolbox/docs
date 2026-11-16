<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignDriversPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignDrivers;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/Drivers',
            title: 'Drivers and source boundaries',
            description: 'Proposed driver capabilities, source resolution, and safe resource projection.',
            sourcePath: 'resources/js/pages/docs/dapter/design/Drivers.vue',
            package: new DapterPackage,
        );
    }
}

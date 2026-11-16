<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignFixturesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignFixtures;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/Fixtures',
            title: 'Shared contract fixtures',
            description: 'Finite Dapter acceptance inputs, expected outcomes, database targets, and verification boundaries.',
            sourcePath: 'resources/js/pages/docs/dapter/design/Fixtures.vue',
            package: new DapterPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Development',
            title: 'Package development',
            description: 'Contribute to Dapter and inspect the roadmap, design proposals, and deferred research separately from usage guides.',
            sourcePath: 'resources/js/pages/docs/dapter/Development.vue',
            package: new DapterPackage,
        );
    }
}

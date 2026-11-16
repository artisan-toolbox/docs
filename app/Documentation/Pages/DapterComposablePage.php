<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterComposablePage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterComposable;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Composable',
            title: 'Share an adapter with component logic',
            description: 'Use a typed composable and an explicit handle to share one listing while keeping another independent.',
            sourcePath: 'resources/js/pages/docs/dapter/Composable.vue',
            package: new DapterPackage,
        );
    }
}

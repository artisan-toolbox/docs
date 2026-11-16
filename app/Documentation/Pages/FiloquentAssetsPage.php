<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentAssetsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentAssets;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Assets',
            title: 'Type and regenerate asset variants',
            description: 'Declare model variant types, backfill missing keys, and enable persisted fallback through a middleware attribute.',
            sourcePath: 'resources/js/pages/docs/filoquent/Assets.vue',
            package: new FiloquentPackage,
        );
    }
}

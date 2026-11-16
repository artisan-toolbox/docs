<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterPage extends Page
{
    public const PageSlug SLUG = PageSlug::Dapter;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Index',
            title: 'Dapter',
            description: 'Headless Vue listings with Collection and SQLite Eloquent sources, offset paging, and server-owned access. Unpublished local preview.',
            sourcePath: 'resources/js/pages/docs/dapter/Index.vue',
            package: new DapterPackage,
        );
    }
}

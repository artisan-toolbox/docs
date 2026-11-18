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
            description: 'Headless Vue listings, native actions, and declared queries for Collections, SQLite, MySQL, and PostgreSQL. Unpublished local preview.',
            sourcePath: 'resources/js/pages/docs/dapter/Index.vue',
            package: new DapterPackage,
        );
    }
}

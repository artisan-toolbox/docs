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
            description: 'Build headless Vue listings with Dapter 1.0.0-beta.2. Read Collections or Eloquent queries, page through results, and run authorized actions.',
            sourcePath: 'resources/js/pages/docs/dapter/Index.vue',
            package: new DapterPackage,
        );
    }
}

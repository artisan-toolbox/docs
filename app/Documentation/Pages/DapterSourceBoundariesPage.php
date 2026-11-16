<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterSourceBoundariesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterSourceBoundaries;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/SourceBoundaries',
            title: 'Keep source scope and row boundaries',
            description: 'Resolve a fresh source, preserve server-owned scope, and expose only JSON-safe public row fields.',
            sourcePath: 'resources/js/pages/docs/dapter/SourceBoundaries.vue',
            package: new DapterPackage,
        );
    }
}

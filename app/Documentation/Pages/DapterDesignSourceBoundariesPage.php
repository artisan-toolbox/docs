<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignSourceBoundariesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignSourceBoundaries;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/SourceBoundaries',
            title: 'Source context and row identity',
            description: 'Proposed source and execution identities, raw record metadata, and projection boundaries for later Dapter capabilities.',
            sourcePath: 'resources/js/pages/docs/dapter/design/SourceBoundaries.vue',
            package: new DapterPackage,
        );
    }
}

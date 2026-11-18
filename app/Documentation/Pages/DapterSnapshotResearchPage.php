<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterSnapshotResearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterSnapshotResearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/SnapshotResearch',
            title: 'Pagination consistency research',
            description: 'Compare high-water bounds, captured membership, frozen values, authorization, recovery, and storage.',
            sourcePath: 'resources/js/pages/docs/dapter/SnapshotResearch.vue',
            package: new DapterPackage,
        );
    }
}

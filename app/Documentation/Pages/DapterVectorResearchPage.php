<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterVectorResearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterVectorResearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/VectorResearch',
            title: 'Vector retrieval research',
            description: 'Inspect native pgvector ranking, scoped counts, prepared inputs, and the remaining ranked-retrieval contract.',
            sourcePath: 'resources/js/pages/docs/dapter/VectorResearch.vue',
            package: new DapterPackage,
        );
    }
}

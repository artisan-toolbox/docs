<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterRevisionRacesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterRevisionRaces;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/RevisionRaces', title: 'Control replacement freshness', description: 'Use typed identity and optional uint64 revisions while preserving accepted rows across request races.', sourcePath: 'resources/js/pages/docs/dapter/RevisionRaces.vue', package: new DapterPackage);
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterSourcesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterSources;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Sources',
            title: 'Data sources',
            description: 'Create Collection or Eloquent sources, keep private records scoped, and choose source-owned defaults.',
            sourcePath: 'resources/js/pages/docs/dapter/Sources.vue',
            package: new DapterPackage,
        );
    }
}

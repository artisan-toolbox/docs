<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterAdvancedQueriesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterAdvancedQueries;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/AdvancedQueries', title: 'Read joined and grouped queries', description: 'Declare complete identities and preserve native query scope.', sourcePath: 'resources/js/pages/docs/dapter/AdvancedQueries.vue', package: new DapterPackage);
    }
}

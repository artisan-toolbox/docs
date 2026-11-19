<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewQueryPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewQuery;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewQuery',
            title: 'Search and filter records',
            description: 'Use field and global criteria, typed choices, and source-defined empty selections.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewQuery.vue',
            package: new FrontAwesomePackage,
        );
    }
}

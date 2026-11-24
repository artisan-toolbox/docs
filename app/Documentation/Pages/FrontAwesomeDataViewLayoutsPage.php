<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewLayoutsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewLayouts;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewLayouts',
            title: 'Switch layouts and customize cells',
            description: 'Switch between a table, grid, and list. Customize cells, loading rows, and empty states.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewLayouts.vue',
            package: new FrontAwesomePackage,
        );
    }
}

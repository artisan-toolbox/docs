<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewPagingPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewPaging;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewPaging',
            title: 'Page, append, and recover',
            description: 'Traverse pages, restart invalid cursors, and append with manual or observed loading.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewPaging.vue',
            package: new FrontAwesomePackage,
        );
    }
}

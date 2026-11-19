<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewOrderingPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewOrdering;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewOrdering',
            title: 'Order records',
            description: 'Choose a sort type and direction, compose priorities, and restore source order.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewOrdering.vue',
            package: new FrontAwesomePackage,
        );
    }
}

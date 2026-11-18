<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewLabPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewLab;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewLab',
            title: 'DataView preview',
            description: 'Use the unpublished Front Awesome DataView with one Dapter handle, configurable layouts, server capabilities, actions, and mode-aware paging.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewLab.vue',
            package: new FrontAwesomePackage,
        );
    }
}

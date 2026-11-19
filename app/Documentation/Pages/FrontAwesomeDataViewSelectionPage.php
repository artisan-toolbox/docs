<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewSelectionPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewSelection;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewSelection',
            title: 'Select and group rows',
            description: 'Select accepted occurrences and span consecutive table cells without changing server order.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewSelection.vue',
            package: new FrontAwesomePackage,
        );
    }
}

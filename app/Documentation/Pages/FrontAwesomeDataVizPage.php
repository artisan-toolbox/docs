<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataVizPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViz;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/DataViz',
            title: 'Data Viz',
            description: 'Present charts and structured data with upstream Pro components.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/DataViz.vue',
            package: new FrontAwesomePackage,
        );
    }
}

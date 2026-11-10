<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePrintingPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePrinting;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Printing',
            title: 'Preview and print documents',
            description: 'Review mixed PDF, ESC/POS, and ZPL jobs with a configurable print drawer.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Printing.vue',
            package: new FrontAwesomePackage,
        );
    }
}

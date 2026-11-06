<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayPrintingPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayPrinting;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Printing',
            title: 'Submit print jobs',
            description: 'Submit ZPL, ESC/POS, raw, and PDF jobs with explicit printer and document options.',
            sourcePath: 'resources/js/pages/docs/qztray/Printing.vue',
            package: new QzTrayPackage,
        );
    }
}

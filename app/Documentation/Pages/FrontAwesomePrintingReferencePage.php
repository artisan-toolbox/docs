<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePrintingReferencePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePrintingReference;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/PrintingReference',
            title: 'Printing service reference',
            description: 'Look up print jobs, source keys, printer preferences, previews, and result states.',
            sourcePath: 'resources/js/pages/docs/front-awesome/PrintingReference.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewReferencePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewReference;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewReference',
            title: 'DataView API reference',
            description: 'Look up layouts, columns, selection, slots, labels, and release availability.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewReference.vue',
            package: new FrontAwesomePackage,
        );
    }
}

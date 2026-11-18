<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterComposedDeclarationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterComposedDeclarations;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/ComposedDeclarations', title: 'Declare and inherit composed operations', description: 'Use fluent options, class attributes, and private methods.', sourcePath: 'resources/js/pages/docs/dapter/ComposedDeclarations.vue', package: new DapterPackage);
    }
}

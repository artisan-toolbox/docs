<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterFieldDeclarationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterFieldDeclarations;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/FieldDeclarations',
            title: 'Replace inherited field declarations',
            description: 'Declare and remove inherited field behavior through fluent options and repeatable PHP attributes.',
            sourcePath: 'resources/js/pages/docs/dapter/FieldDeclarations.vue',
            package: new DapterPackage,
        );
    }
}

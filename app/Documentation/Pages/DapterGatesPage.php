<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterGatesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterGates;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Gates',
            title: 'Authorize source reads',
            description: 'Apply Gate checks and explicit public access without bypassing server authorization.',
            sourcePath: 'resources/js/pages/docs/dapter/Gates.vue',
            package: new DapterPackage,
        );
    }
}

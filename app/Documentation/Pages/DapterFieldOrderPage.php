<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterFieldOrderPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterFieldOrder;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/FieldOrder',
            title: 'Sort data',
            description: 'Sort a listing, choose a comparison mode, and combine permitted sort terms.',
            sourcePath: 'resources/js/pages/docs/dapter/FieldOrder.vue',
            package: new DapterPackage,
        );
    }
}

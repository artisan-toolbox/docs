<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterMultiOrderPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterMultiOrder;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/MultiOrder', title: 'Compose multiple order terms', description: 'Keep requested order, fixed terms, and identity ties separate.', sourcePath: 'resources/js/pages/docs/dapter/MultiOrder.vue', package: new DapterPackage);
    }
}

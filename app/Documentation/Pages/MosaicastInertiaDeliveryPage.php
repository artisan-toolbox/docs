<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastInertiaDeliveryPage extends Page
{
    public const PageSlug SLUG = PageSlug::MosaicastInertiaDelivery;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/InertiaDelivery',
            title: 'Inertia delivery',
            description: 'Deliver Mosaicast events through Inertia shared props with broadcast fallback.',
            sourcePath: 'resources/js/pages/docs/mosaicast/InertiaDelivery.vue',
            package: new MosaicastPackage,
        );
    }
}

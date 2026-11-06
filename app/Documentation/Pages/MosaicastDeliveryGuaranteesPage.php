<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastDeliveryGuaranteesPage extends Page
{
    public const PageSlug SLUG = PageSlug::MosaicastDeliveryGuarantees;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/DeliveryGuarantees',
            title: 'Delivery guarantees',
            description: 'The Mosaicast delivery contract and the realtime constraints applications should account for.',
            sourcePath: 'resources/js/pages/docs/mosaicast/DeliveryGuarantees.vue',
            package: new MosaicastPackage,
        );
    }
}

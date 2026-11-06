<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CoreMultiDomainInertiaPage extends Page
{
    public const PageSlug SLUG = PageSlug::CoreMultiDomainInertia;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/MultiDomainInertia',
            title: 'Multi-domain Inertia Visits',
            description: 'Configure CORS and force full-page Inertia visits when navigation crosses trusted domains or subdomains.',
            sourcePath: 'resources/js/pages/docs/core/MultiDomainInertia.vue',
            package: new CorePackage,
        );
    }
}

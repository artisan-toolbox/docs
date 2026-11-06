<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CorePage extends Page
{
    public const PageSlug SLUG = PageSlug::Core;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/Index',
            title: 'Core',
            description: 'Focused Laravel helpers for conditional arrays, translated model attributes, and cross-domain Inertia visits.',
            sourcePath: 'resources/js/pages/docs/core/Index.vue',
            package: new CorePackage,
        );
    }
}

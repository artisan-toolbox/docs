<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitOperationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitOperations;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Operations',
            title: 'Deploy and maintain Permit',
            description: 'Look up Artisan commands, configure caching, and migrate saved permissions and roles.',
            sourcePath: 'resources/js/pages/docs/permit/Operations.vue',
            package: new PermitPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Development',
            title: 'Develop Permit',
            description: 'Validate the Permit package, maintain its generated README metadata, and build its Vue distribution.',
            sourcePath: 'resources/js/pages/docs/permit/Development.vue',
            package: new PermitPackage,
        );
    }
}

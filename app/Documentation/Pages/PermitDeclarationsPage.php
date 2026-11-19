<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitDeclarationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitDeclarations;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Declarations',
            title: 'Declare permissions and roles',
            description: 'Define Gate names, roles, defaults, and display order with PHP attributes.',
            sourcePath: 'resources/js/pages/docs/permit/Declarations.vue',
            package: new PermitPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Installation',
            title: 'Install Permit',
            description: 'Install the published Permit beta, run the assignment migration, and check a permission.',
            sourcePath: 'resources/js/pages/docs/permit/Installation.vue',
            package: new PermitPackage,
        );
    }
}

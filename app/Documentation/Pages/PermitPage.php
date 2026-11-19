<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitPage extends Page
{
    public const PageSlug SLUG = PageSlug::Permit;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Index',
            title: 'Permit',
            description: 'Register your first permission, assign it to a user, and verify the decision through a Laravel Gate.',
            sourcePath: 'resources/js/pages/docs/permit/Index.vue',
            package: new PermitPackage,
        );
    }
}

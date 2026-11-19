<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitManagementPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitManagement;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Management',
            title: 'Manage user permissions',
            description: 'Assign and inspect permissions, try the interactive editor, and scope management to allowed users.',
            sourcePath: 'resources/js/pages/docs/permit/Management.vue',
            package: new PermitPackage,
        );
    }
}

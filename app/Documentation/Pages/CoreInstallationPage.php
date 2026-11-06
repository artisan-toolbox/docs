<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CoreInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::CoreInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/Installation',
            title: 'Install Core',
            description: 'Install Core in Laravel and build your first conditional array without publishing resources.',
            sourcePath: 'resources/js/pages/docs/core/Installation.vue',
            package: new CorePackage,
        );
    }
}

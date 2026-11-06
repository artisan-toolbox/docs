<?php

namespace App\Documentation\Pages;

use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class ChoosePackagePage extends Page
{
    public const PageSlug SLUG = PageSlug::ChoosePackage;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/getting-started/ChoosePackage',
            title: 'Choose a Package',
            description: 'Find the Artisan Toolbox package that matches your current task.',
            sourcePath: 'resources/js/pages/docs/getting-started/ChoosePackage.vue',
        );
    }
}

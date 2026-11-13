<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Development',
            title: 'Develop Dapter',
            description: 'Run Dapter backend and frontend checks, build typed library entries, and maintain the package identity.',
            sourcePath: 'resources/js/pages/docs/dapter/Development.vue',
            package: new DapterPackage,
        );
    }
}

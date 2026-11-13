<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Development',
            title: 'Develop Filoquent',
            description: 'Use the Filoquent workbench, contributor standards, version metadata, and package checks.',
            sourcePath: 'resources/js/pages/docs/filoquent/Development.vue',
            package: new FiloquentPackage,
        );
    }
}

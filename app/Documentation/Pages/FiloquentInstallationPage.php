<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Installation',
            title: 'Install Filoquent',
            description: 'Install a reviewed Filoquent development preview and save a file through a cast Eloquent attribute.',
            sourcePath: 'resources/js/pages/docs/filoquent/Installation.vue',
            package: new FiloquentPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentConfigurationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentConfiguration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Configuration',
            title: 'Filoquent configuration',
            description: 'Configure Filoquent filesystems, fixed model directories, filenames, and upload middleware.',
            sourcePath: 'resources/js/pages/docs/filoquent/Configuration.vue',
            package: new FiloquentPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentFilesPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentFiles;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Files',
            title: 'Work with file attributes',
            description: 'Assign files, consume stored assets, and generate variants with Filoquent middleware.',
            sourcePath: 'resources/js/pages/docs/filoquent/Files.vue',
            package: new FiloquentPackage,
        );
    }
}

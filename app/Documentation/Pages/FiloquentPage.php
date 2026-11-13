<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentPage extends Page
{
    public const PageSlug SLUG = PageSlug::Filoquent;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Index',
            title: 'Filoquent',
            description: 'Save uploaded files, local paths, and streams through Eloquent attributes in the Filoquent development preview.',
            sourcePath: 'resources/js/pages/docs/filoquent/Index.vue',
            package: new FiloquentPackage,
        );
    }
}

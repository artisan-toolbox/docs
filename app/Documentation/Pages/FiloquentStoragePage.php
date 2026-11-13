<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentStoragePage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentStorage;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Storage',
            title: 'Storage lifecycle and recovery',
            description: 'Understand ownership, persistent file paths, transactions, indexed cleanup, and recovery limits in Filoquent.',
            sourcePath: 'resources/js/pages/docs/filoquent/Storage.vue',
            package: new FiloquentPackage,
        );
    }
}

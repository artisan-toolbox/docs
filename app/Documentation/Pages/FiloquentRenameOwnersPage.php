<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentRenameOwnersPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentRenameOwners;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/RenameOwners',
            title: 'Rename file owners safely',
            description: 'Rename Filoquent models, file columns, and physical tables, then resolve durable missing-table groups without guessing ownership or moving files.',
            sourcePath: 'resources/js/pages/docs/filoquent/RenameOwners.vue',
            package: new FiloquentPackage,
        );
    }
}

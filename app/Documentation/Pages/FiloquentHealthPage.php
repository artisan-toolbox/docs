<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentHealthPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentHealth;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Health',
            title: 'Check stored file health',
            description: 'Audit files referenced by active Filoquent owners without changing storage or lifecycle metadata, and schedule background checks.',
            sourcePath: 'resources/js/pages/docs/filoquent/Health.vue',
            package: new FiloquentPackage,
        );
    }
}

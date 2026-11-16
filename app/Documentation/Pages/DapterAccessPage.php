<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterAccessPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterAccess;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Access',
            title: 'Authenticate a data source',
            description: 'Choose a guard and verify required source access with isolated fictional principals.',
            sourcePath: 'resources/js/pages/docs/dapter/Access.vue',
            package: new DapterPackage,
        );
    }
}

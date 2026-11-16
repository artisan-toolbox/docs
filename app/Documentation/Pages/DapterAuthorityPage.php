<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterAuthorityPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterAuthority;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Authority',
            title: 'Understand server authority',
            description: 'Follow a declared source through request validation, driver support, and the accepted listing result.',
            sourcePath: 'resources/js/pages/docs/dapter/Authority.vue',
            package: new DapterPackage,
        );
    }
}

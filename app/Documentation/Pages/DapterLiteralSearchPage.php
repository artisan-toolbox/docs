<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterLiteralSearchPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterLiteralSearch;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/LiteralSearch',
            title: 'Choose literal search sensitivity',
            description: 'Set case and accent sensitivity on the source while keeping field and global requests unchanged.',
            sourcePath: 'resources/js/pages/docs/dapter/LiteralSearch.vue',
            package: new DapterPackage,
        );
    }
}

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
            title: 'Reference and behavior',
            description: 'Look up request formats, errors, capabilities, validation, and source-specific behavior after building a working listing.',
            sourcePath: 'resources/js/pages/docs/dapter/Authority.vue',
            package: new DapterPackage,
        );
    }
}

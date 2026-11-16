<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterOptionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterOptions;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Options',
            title: 'Configure paging defaults',
            description: 'Configure page sizes, attributes, empty baselines, and inherited options through isolated examples.',
            sourcePath: 'resources/js/pages/docs/dapter/Options.vue',
            package: new DapterPackage,
        );
    }
}

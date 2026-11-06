<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DumpToConsolePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DumpToConsoleUsagePage extends Page
{
    public const PageSlug SLUG = PageSlug::DumpToConsoleUsage;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dump-to-console/Usage',
            title: 'Usage and Configuration',
            description: 'Configure the listener and use helpers, fluent dumps, and benchmarks.',
            sourcePath: 'resources/js/pages/docs/dump-to-console/Usage.vue',
            package: new DumpToConsolePackage,
        );
    }
}

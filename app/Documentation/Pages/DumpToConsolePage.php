<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DumpToConsolePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DumpToConsolePage extends Page
{
    public const PageSlug SLUG = PageSlug::DumpToConsole;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dump-to-console/Index',
            title: 'Dump to Console',
            description: 'Send Laravel debug output to a local console without interrupting the application.',
            sourcePath: 'resources/js/pages/docs/dump-to-console/Index.vue',
            package: new DumpToConsolePackage,
        );
    }
}

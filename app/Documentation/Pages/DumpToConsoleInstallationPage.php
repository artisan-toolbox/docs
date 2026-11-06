<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DumpToConsolePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DumpToConsoleInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DumpToConsoleInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dump-to-console/Installation',
            title: 'Install Dump to Console',
            description: 'Install the Laravel helper, start a local listener, and send your first debug value.',
            sourcePath: 'resources/js/pages/docs/dump-to-console/Installation.vue',
            package: new DumpToConsolePackage,
        );
    }
}

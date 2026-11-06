<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayFrontendToolingPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayFrontendTooling;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/FrontendTooling',
            title: 'Build and distribute the frontend',
            description: 'Build the package frontend, prepare Composer releases, and use local development links.',
            sourcePath: 'resources/js/pages/docs/qztray/FrontendTooling.vue',
            package: new QzTrayPackage,
        );
    }
}

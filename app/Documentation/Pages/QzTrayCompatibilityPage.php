<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayCompatibilityPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayCompatibility;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Compatibility',
            title: 'Compatibility and API limits',
            description: 'Supported environments and observable integration limits for QZ Tray 1.x.',
            sourcePath: 'resources/js/pages/docs/qztray/Compatibility.vue',
            package: new QzTrayPackage,
        );
    }
}

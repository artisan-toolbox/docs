<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTray;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Index',
            title: 'QZ Tray Connector',
            description: 'Laravel credentials, shared QZ Tray printing, and local ZPL, ESC/POS, and PDF previews.',
            sourcePath: 'resources/js/pages/docs/qztray/Index.vue',
            package: new QzTrayPackage,
        );
    }
}

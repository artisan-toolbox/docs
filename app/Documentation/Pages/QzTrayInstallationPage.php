<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Installation',
            title: 'Install QZ Tray Connector',
            description: 'Install the Laravel and frontend packages, preview a label, and prepare optional authenticated printing.',
            sourcePath: 'resources/js/pages/docs/qztray/Installation.vue',
            package: new QzTrayPackage,
        );
    }
}

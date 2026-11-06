<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayEscposPreviewsPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayEscposPreviews;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/EscposPreviews',
            title: 'Preview ESC/POS receipts',
            description: 'Render receipt commands and supported images locally without connecting to a printer.',
            sourcePath: 'resources/js/pages/docs/qztray/EscposPreviews.vue',
            package: new QzTrayPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayZplPreviewsPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayZplPreviews;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/ZplPreviews',
            title: 'Preview ZPL labels',
            description: 'Render ZPL labels locally and configure label dimensions, encoding, and renderer assets.',
            sourcePath: 'resources/js/pages/docs/qztray/ZplPreviews.vue',
            package: new QzTrayPackage,
        );
    }
}

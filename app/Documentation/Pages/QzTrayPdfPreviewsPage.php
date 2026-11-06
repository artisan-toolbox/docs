<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayPdfPreviewsPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayPdfPreviews;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/PdfPreviews',
            title: 'Preview PDF documents',
            description: 'Render PDF URLs and content locally with page selection and browser download options.',
            sourcePath: 'resources/js/pages/docs/qztray/PdfPreviews.vue',
            package: new QzTrayPackage,
        );
    }
}

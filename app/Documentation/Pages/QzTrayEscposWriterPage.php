<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayEscposWriterPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayEscposWriter;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/EscposWriter',
            title: 'Generate ESC/POS receipts',
            description: 'Build configurable ESC/POS receipts in Laravel using an in-memory Mike42 writer.',
            sourcePath: 'resources/js/pages/docs/qztray/EscposWriter.vue',
            package: new QzTrayPackage,
        );
    }
}

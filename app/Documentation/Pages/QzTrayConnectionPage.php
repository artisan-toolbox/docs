<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayConnectionPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayConnection;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Connection',
            title: 'Connect and find printers',
            description: 'Manage the shared browser connection, local permissions, and printer discovery.',
            sourcePath: 'resources/js/pages/docs/qztray/Connection.vue',
            package: new QzTrayPackage,
        );
    }
}

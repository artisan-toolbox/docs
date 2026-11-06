<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTraySecurityPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTraySecurity;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Security',
            title: 'Configure credentials and secure printing',
            description: 'Configure server credentials, Ziggy routes, authenticated signing, and error handling.',
            sourcePath: 'resources/js/pages/docs/qztray/Security.vue',
            package: new QzTrayPackage,
        );
    }
}

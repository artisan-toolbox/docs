<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\QzTrayPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class QzTrayDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::QzTrayDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/qztray/Development',
            title: 'Validate and contribute to the package',
            description: 'Run package validation and find contribution, security, and source resources.',
            sourcePath: 'resources/js/pages/docs/qztray/Development.vue',
            package: new QzTrayPackage,
        );
    }
}

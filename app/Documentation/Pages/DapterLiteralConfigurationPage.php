<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterLiteralConfigurationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterLiteralConfiguration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/LiteralConfiguration',
            title: 'Configure literal search defaults',
            description: 'Resolve source attributes, captured configuration, false overrides, and aware custom drivers.',
            sourcePath: 'resources/js/pages/docs/dapter/LiteralConfiguration.vue',
            package: new DapterPackage,
        );
    }
}

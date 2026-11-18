<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterVueDefinitionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterVueDefinitions;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/VueDefinitions',
            title: 'Validate rows and definitions separately',
            description: 'Narrow authorized capabilities without inferring operations from record keys.',
            sourcePath: 'resources/js/pages/docs/dapter/VueDefinitions.vue',
            package: new DapterPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Development',
            title: 'Development and Building',
            description: 'Develop, validate, and build the Maintainer PHAR.',
            sourcePath: 'resources/js/pages/docs/maintainer/Development.vue',
            package: new MaintainerPackage,
        );
    }
}

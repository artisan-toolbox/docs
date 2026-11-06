<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerCiPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerCi;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/Ci',
            title: 'Code Quality',
            description: "Run the consuming project's code-quality tools locally or in continuous integration.",
            sourcePath: 'resources/js/pages/docs/maintainer/Ci.vue',
            package: new MaintainerPackage,
        );
    }
}

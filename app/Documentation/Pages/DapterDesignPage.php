<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesign;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Design',
            title: 'Proposed Dapter design',
            description: 'Explore specialized proposed contracts separately from implemented guides and roadmap progress.',
            sourcePath: 'resources/js/pages/docs/dapter/Design.vue',
            package: new DapterPackage,
        );
    }
}

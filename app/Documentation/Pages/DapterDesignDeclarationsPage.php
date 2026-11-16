<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignDeclarationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignDeclarations;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/Declarations',
            title: 'Declarations and defaults',
            description: 'Proposed StoreOptions, attributes, fixed domains, and declaration composition.',
            sourcePath: 'resources/js/pages/docs/dapter/design/Declarations.vue',
            package: new DapterPackage,
        );
    }
}

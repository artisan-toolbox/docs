<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignOperationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignOperations;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/Operations',
            title: 'Search, filters, and ordering',
            description: 'Proposed declared operations, scoped callbacks, enums, and complex query behavior.',
            sourcePath: 'resources/js/pages/docs/dapter/design/Operations.vue',
            package: new DapterPackage,
        );
    }
}

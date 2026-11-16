<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignPagingStatePage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignPagingState;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/PagingState',
            title: 'Pagination and adapter state',
            description: 'Proposed pagination, state preservation, and remaining typed slot contracts.',
            sourcePath: 'resources/js/pages/docs/dapter/design/PagingState.vue',
            package: new DapterPackage,
        );
    }
}

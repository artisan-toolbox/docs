<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignActionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignActions;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/Actions',
            title: 'DataStore action design',
            description: 'Proposed private and external actions through package-owned native Inertia and HTTP routes.',
            sourcePath: 'resources/js/pages/docs/dapter/design/Actions.vue',
            package: new DapterPackage,
        );
    }
}

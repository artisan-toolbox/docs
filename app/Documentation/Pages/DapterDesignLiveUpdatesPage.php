<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterDesignLiveUpdatesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterDesignLiveUpdates;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/design/LiveUpdates',
            title: 'Requests and live updates',
            description: 'Proposed URL, scrolling, broadcast, polling, and advanced loading behavior.',
            sourcePath: 'resources/js/pages/docs/dapter/design/LiveUpdates.vue',
            package: new DapterPackage,
        );
    }
}

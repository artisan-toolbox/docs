<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterLiveUpdatesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterLiveUpdates;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/LiveUpdates', title: 'Refresh data', description: 'Choose periodic polling or committed row updates, with queue and broadcasting setup when using push updates.', sourcePath: 'resources/js/pages/docs/dapter/LiveUpdates.vue', package: new DapterPackage);
    }
}

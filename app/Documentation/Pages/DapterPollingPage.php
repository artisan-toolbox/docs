<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterPollingPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterPolling;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/Polling', title: 'Refresh a listing with polling', description: 'Schedule optional standalone HTTP refreshes after render settlement and recover deliberately from failures.', sourcePath: 'resources/js/pages/docs/dapter/Polling.vue', package: new DapterPackage);
    }
}

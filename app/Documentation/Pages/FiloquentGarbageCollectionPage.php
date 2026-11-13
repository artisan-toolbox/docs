<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentGarbageCollectionPage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentGarbageCollection;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/GarbageCollection',
            title: 'Collect orphaned uploads',
            description: 'Consolidate optional Redis upload intents and reconcile indexed SQL receipts with bounded batches and a minimum 24-hour grace period.',
            sourcePath: 'resources/js/pages/docs/filoquent/GarbageCollection.vue',
            package: new FiloquentPackage,
        );
    }
}

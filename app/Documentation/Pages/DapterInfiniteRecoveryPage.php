<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterInfiniteRecoveryPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterInfiniteRecovery;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/InfiniteRecovery', title: 'Recover and refresh infinite windows', description: 'Pause failed appends, bound automatic fill, and restore the start of an infinite window.', sourcePath: 'resources/js/pages/docs/dapter/InfiniteRecovery.vue', package: new DapterPackage);
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterCursorRecoveryPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterCursorRecovery;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/CursorRecovery', title: 'Recover cursor authorization and expiry', description: 'Observe real cursor expiry and fictional scope changes, then explicitly restart through the public API.', sourcePath: 'resources/js/pages/docs/dapter/CursorRecovery.vue', package: new DapterPackage);
    }
}

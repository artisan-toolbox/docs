<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterLiveAuthorizationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterLiveAuthorization;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/LiveAuthorization', title: 'Authorize a live source', description: 'Register stable definitions and reconstruct current reader context before any protected source read.', sourcePath: 'resources/js/pages/docs/dapter/LiveAuthorization.vue', package: new DapterPackage);
    }
}

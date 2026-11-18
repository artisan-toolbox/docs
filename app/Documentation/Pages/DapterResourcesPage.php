<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterResourcesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterResources;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/Resources', title: 'Transform rows', description: 'Use Laravel Resources to choose the fields returned for each row and keep internal values off the wire.', sourcePath: 'resources/js/pages/docs/dapter/Resources.vue', package: new DapterPackage);
    }
}

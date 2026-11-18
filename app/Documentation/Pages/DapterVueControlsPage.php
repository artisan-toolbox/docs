<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterVueControlsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterVueControls;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/VueControls',
            title: 'Vue controls',
            description: 'Connect listing controls to a DataAdapter, share its owner, and save navigation in the URL.',
            sourcePath: 'resources/js/pages/docs/dapter/VueControls.vue',
            package: new DapterPackage,
        );
    }
}

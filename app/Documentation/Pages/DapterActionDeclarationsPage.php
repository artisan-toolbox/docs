<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterActionDeclarationsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterActionDeclarations;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/ActionDeclarations', title: 'Declare dedicated action methods', description: 'Choose inline, inherited, trait, or dedicated action ownership.', sourcePath: 'resources/js/pages/docs/dapter/ActionDeclarations.vue', package: new DapterPackage);
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterActionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterActions;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/Actions', title: 'Run actions', description: 'Run an authorized write from a listing and show its result. Learn record targets and uncertain outcomes in focused guides.', sourcePath: 'resources/js/pages/docs/dapter/Actions.vue', package: new DapterPackage);
    }
}

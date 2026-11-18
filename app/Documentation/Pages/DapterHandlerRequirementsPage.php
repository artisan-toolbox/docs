<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterHandlerRequirementsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterHandlerRequirements;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/HandlerRequirements', title: 'Require a source, engine, or driver', description: 'Reject incompatible handler requirements before construction.', sourcePath: 'resources/js/pages/docs/dapter/HandlerRequirements.vue', package: new DapterPackage);
    }
}

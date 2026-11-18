<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterActionOutcomesPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterActionOutcomes;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/ActionOutcomes', title: 'Handle record targets and uncertain writes', description: 'Reauthorize exact targets and inspect unknown commit outcomes.', sourcePath: 'resources/js/pages/docs/dapter/ActionOutcomes.vue', package: new DapterPackage);
    }
}

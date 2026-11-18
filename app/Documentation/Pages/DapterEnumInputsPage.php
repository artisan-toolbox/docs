<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterEnumInputsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterEnumInputs;

    public function __construct()
    {
        parent::__construct(slug: self::SLUG, component: 'docs/dapter/EnumInputs', title: 'Bind finite enum inputs', description: 'Preserve enum subsets, exact scalar values, pure cases, and nullable inputs.', sourcePath: 'resources/js/pages/docs/dapter/EnumInputs.vue', package: new DapterPackage);
    }
}

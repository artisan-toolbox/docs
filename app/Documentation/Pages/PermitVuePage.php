<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitVuePage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitVue;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Vue',
            title: 'Show authorized actions in Vue',
            description: 'Use the optional Vue plugin to render the current actor\'s Laravel Gate decisions.',
            sourcePath: 'resources/js/pages/docs/permit/Vue.vue',
            package: new PermitPackage,
        );
    }
}

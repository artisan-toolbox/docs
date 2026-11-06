<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeVuePluginPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeVuePlugin;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/VuePlugin',
            title: 'Vue plugin',
            description: 'Register the toast service, enable color mode, and configure Mosaicast and Echo.',
            sourcePath: 'resources/js/pages/docs/front-awesome/VuePlugin.vue',
            package: new FrontAwesomePackage,
        );
    }
}

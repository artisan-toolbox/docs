<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastVuePluginPage extends Page
{
    public const PageSlug SLUG = PageSlug::MosaicastVuePlugin;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/VuePlugin',
            title: 'Vue plugin',
            description: 'Connect a Vue and Inertia application to the private Mosaicast session channel.',
            sourcePath: 'resources/js/pages/docs/mosaicast/VuePlugin.vue',
            package: new MosaicastPackage,
        );
    }
}

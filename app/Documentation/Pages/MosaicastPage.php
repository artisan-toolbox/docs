<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastPage extends Page
{
    public const PageSlug SLUG = PageSlug::Mosaicast;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/Index',
            title: 'Mosaicast',
            description: 'Deliver Laravel events through Inertia props or private session broadcasting.',
            sourcePath: 'resources/js/pages/docs/mosaicast/Index.vue',
            package: new MosaicastPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::MosaicastInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/Installation',
            title: 'Install Mosaicast',
            description: 'Install the Laravel and Vue packages and receive your first event through an Inertia response.',
            sourcePath: 'resources/js/pages/docs/mosaicast/Installation.vue',
            package: new MosaicastPackage,
        );
    }
}

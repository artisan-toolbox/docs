<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeInstallationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeInstallation;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Installation',
            title: 'Install Front Awesome',
            description: 'Install the development package with Composer and register its frontend packages with npm.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Installation.vue',
            package: new FrontAwesomePackage,
        );
    }
}

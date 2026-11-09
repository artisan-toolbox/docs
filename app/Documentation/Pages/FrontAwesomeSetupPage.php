<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeSetupPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeSetup;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Setup',
            title: 'Vue integration',
            description: 'Register the Vue plugin and configure Front Awesome for your Laravel application.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Setup.vue',
            package: new FrontAwesomePackage,
        );
    }
}

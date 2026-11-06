<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeConfigurationPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeConfiguration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Configuration',
            title: 'Package configuration',
            description: 'Publish the Laravel configuration and customize default toast icons by variant.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Configuration.vue',
            package: new FrontAwesomePackage,
        );
    }
}

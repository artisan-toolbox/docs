<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDevelopmentPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDevelopment;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Development',
            title: 'Develop Front Awesome',
            description: 'Set up a package checkout, run the validation suite, and find the frontend agent skills.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Development.vue',
            package: new FrontAwesomePackage,
        );
    }
}

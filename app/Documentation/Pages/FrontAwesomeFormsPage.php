<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeFormsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeForms;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Forms',
            title: 'Forms',
            description: 'Collect values and bind form state.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Forms.vue',
            package: new FrontAwesomePackage,
        );
    }
}

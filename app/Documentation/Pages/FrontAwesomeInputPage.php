<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeInputPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeInput;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/Input',
            title: 'Bind input values and form errors',
            description: 'Use the Vue Input with v-model or an Inertia form, including nested array fields and server errors.',
            sourcePath: 'resources/js/pages/docs/front-awesome/Input.vue',
            package: new FrontAwesomePackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterSourceRegistrationPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterSourceRegistration;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/SourceRegistration',
            title: 'Register source and driver aliases',
            description: 'Register trusted source aliases and driver factories without changing conventional source discovery.',
            sourcePath: 'resources/js/pages/docs/dapter/SourceRegistration.vue',
            package: new DapterPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeSharedThemePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeSharedTheme;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/SharedTheme',
            title: 'Use the shared Tailwind theme',
            description: 'Install the optional Tailwind 4 adapter for Web Awesome with one editable branding file.',
            sourcePath: 'resources/js/pages/docs/front-awesome/SharedTheme.vue',
            package: new FrontAwesomePackage,
        );
    }
}

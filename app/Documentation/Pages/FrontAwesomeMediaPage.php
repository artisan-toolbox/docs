<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeMediaPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeMedia;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Media',
            title: 'Media',
            description: 'Present images, icons, code, and other media.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Media.vue',
            package: new FrontAwesomePackage,
        );
    }
}

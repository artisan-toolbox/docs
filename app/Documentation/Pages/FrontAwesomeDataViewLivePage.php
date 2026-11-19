<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewLivePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewLive;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewLive',
            title: 'Refresh projected rows',
            description: 'Follow projected records with polling or authorized broadcast replacements.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewLive.vue',
            package: new FrontAwesomePackage,
        );
    }
}

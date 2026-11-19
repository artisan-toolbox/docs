<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewStatePage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewState;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewState',
            title: 'Share and restore adapter state',
            description: 'Understand accepted results, browser history, scroll position, snapshots, and context changes.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewState.vue',
            package: new FrontAwesomePackage,
        );
    }
}

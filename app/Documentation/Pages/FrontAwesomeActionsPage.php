<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeActionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeActions;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/web-awesome/components/Actions',
            title: 'Actions',
            description: 'Choose and group action controls.',
            sourcePath: 'resources/js/pages/docs/front-awesome/web-awesome/components/Actions.vue',
            package: new FrontAwesomePackage,
        );
    }
}

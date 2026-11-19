<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeDataViewActionsPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeDataViewActions;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/DataViewActions',
            title: 'Run an authorized action',
            description: 'Submit a named action with a known input, verify the record selector, and interpret the result.',
            sourcePath: 'resources/js/pages/docs/front-awesome/DataViewActions.vue',
            package: new FrontAwesomePackage,
        );
    }
}

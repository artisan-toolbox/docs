<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CoreConditionalArraysPage extends Page
{
    public const PageSlug SLUG = PageSlug::CoreConditionalArrays;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/ConditionalArrays',
            title: 'Sift conditional arrays',
            description: 'Include values conditionally and recursively remove rejected entries with Laravel iterable utilities.',
            sourcePath: 'resources/js/pages/docs/core/ConditionalArrays.vue',
            package: new CorePackage,
        );
    }
}

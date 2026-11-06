<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CoreTranslatedAttributesPage extends Page
{
    public const PageSlug SLUG = PageSlug::CoreTranslatedAttributes;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/TranslatedAttributes',
            title: 'Translated Model Attributes',
            description: 'Store translation keys in the database and resolve them with the current Laravel locale when Eloquent attributes are read.',
            sourcePath: 'resources/js/pages/docs/core/TranslatedAttributes.vue',
            package: new CorePackage,
        );
    }
}

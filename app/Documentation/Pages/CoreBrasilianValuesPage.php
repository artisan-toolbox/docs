<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\CorePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class CoreBrasilianValuesPage extends Page
{
    public const PageSlug SLUG = PageSlug::CoreBrasilianValues;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/core/BrasilianValues',
            title: 'Validate Brazilian Documents and Phone Numbers',
            description: 'Validate CPF, numeric and alphanumeric CNPJ, and Brazilian phone numbers in Laravel forms.',
            sourcePath: 'resources/js/pages/docs/core/BrasilianValues.vue',
            package: new CorePackage,
        );
    }
}

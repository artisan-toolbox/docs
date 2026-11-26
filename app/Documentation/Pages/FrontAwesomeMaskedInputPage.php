<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomeMaskedInputPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomeMaskedInput;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/MaskedInput',
            title: 'Format text as users type',
            description: 'Use MaskedInput for postal codes, documents, phone numbers, and structured identifiers.',
            sourcePath: 'resources/js/pages/docs/front-awesome/MaskedInput.vue',
            package: new FrontAwesomePackage,
        );
    }
}

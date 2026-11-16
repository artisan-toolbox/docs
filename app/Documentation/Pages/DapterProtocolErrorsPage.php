<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterProtocolErrorsPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterProtocolErrors;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Errors',
            title: 'Handle listing protocol errors',
            description: 'Distinguish malformed JSON, validation, access, unsupported operations, and server failures without exposing protected data.',
            sourcePath: 'resources/js/pages/docs/dapter/Errors.vue',
            package: new DapterPackage,
        );
    }
}

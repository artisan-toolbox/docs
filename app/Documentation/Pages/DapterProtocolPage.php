<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterProtocolPage extends Page
{
    public const PageSlug SLUG = PageSlug::DapterProtocol;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/Protocol',
            title: 'Read the versioned listing protocol',
            description: 'Inspect version 1 requests, bounded responses, shared contract examples, and listing action outcomes.',
            sourcePath: 'resources/js/pages/docs/dapter/Protocol.vue',
            package: new DapterPackage,
        );
    }
}

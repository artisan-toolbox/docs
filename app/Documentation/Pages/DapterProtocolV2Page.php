<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\DapterPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class DapterProtocolV2Page extends Page
{
    public const PageSlug SLUG = PageSlug::DapterProtocolV2;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/dapter/ProtocolV2',
            title: 'Backend field protocol v2',
            description: 'Reference the delivered field request grammar, canonical acknowledgement, capabilities, and unidentified metadata.',
            sourcePath: 'resources/js/pages/docs/dapter/ProtocolV2.vue',
            package: new DapterPackage,
        );
    }
}

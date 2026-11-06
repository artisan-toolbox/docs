<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerConfigurationPublishingPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerConfigurationPublishing;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/configuration/Publishing',
            title: 'Publish Configuration',
            description: 'Selectively publish Maintainer, quality, testing, and deployment templates.',
            sourcePath: 'resources/js/pages/docs/maintainer/configuration/Publishing.vue',
            package: new MaintainerPackage,
        );
    }
}

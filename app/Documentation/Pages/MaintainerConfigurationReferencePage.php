<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerConfigurationReferencePage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerConfigurationReference;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/configuration/Reference',
            title: 'Configuration Reference',
            description: 'Configure Maintainer defaults, secrets, environment variables, encryption, and AI providers.',
            sourcePath: 'resources/js/pages/docs/maintainer/configuration/Reference.vue',
            package: new MaintainerPackage,
        );
    }
}

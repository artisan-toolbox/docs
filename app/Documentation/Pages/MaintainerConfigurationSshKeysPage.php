<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerConfigurationSshKeysPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerConfigurationSshKeys;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/configuration/SshKeys',
            title: 'SSH Keys',
            description: "Generate, display, and consume Maintainer's encrypted SSH identity.",
            sourcePath: 'resources/js/pages/docs/maintainer/configuration/SshKeys.vue',
            package: new MaintainerPackage,
        );
    }
}

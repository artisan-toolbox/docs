<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerVersioningReleasesPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerVersioningReleases;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/versioning/Releases',
            title: 'Create Releases',
            description: 'Select a semantic version, generate release content, and publish a GitHub release.',
            sourcePath: 'resources/js/pages/docs/maintainer/versioning/Releases.vue',
            package: new MaintainerPackage,
        );
    }
}

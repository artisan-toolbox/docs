<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerVersioningCommitsPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerVersioningCommits;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/versioning/Commits',
            title: 'Create Commits',
            description: 'Select working-tree changes and create a manual or AI-generated Conventional Commit.',
            sourcePath: 'resources/js/pages/docs/maintainer/versioning/Commits.vue',
            package: new MaintainerPackage,
        );
    }
}

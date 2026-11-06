<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerDeploymentRepositoryTagsPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerDeploymentRepositoryTags;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/deployment/RepositoryTags',
            title: 'Repository Tag Selection',
            description: 'Select recent semantic Git tags before a Deployer release is prepared.',
            sourcePath: 'resources/js/pages/docs/maintainer/deployment/RepositoryTags.vue',
            package: new MaintainerPackage,
        );
    }
}

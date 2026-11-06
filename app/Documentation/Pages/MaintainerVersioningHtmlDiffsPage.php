<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MaintainerPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MaintainerVersioningHtmlDiffsPage extends Page
{
    public const PageSlug SLUG = PageSlug::MaintainerVersioningHtmlDiffs;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/maintainer/versioning/HtmlDiffs',
            title: 'HTML Git Diffs',
            description: 'Render working-tree or Git-reference comparisons and review them in a browser.',
            sourcePath: 'resources/js/pages/docs/maintainer/versioning/HtmlDiffs.vue',
            package: new MaintainerPackage,
        );
    }
}

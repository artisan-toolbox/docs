<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FrontAwesomePackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePermissionEditorPage extends Page
{
    public const PageSlug SLUG = PageSlug::FrontAwesomePermissionEditor;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/front-awesome/PermissionEditor',
            title: 'Edit user permissions',
            description: 'Connect the generic permission dialog to a same-origin Inertia management endpoint.',
            sourcePath: 'resources/js/pages/docs/front-awesome/PermissionEditor.vue',
            package: new FrontAwesomePackage,
        );
    }
}

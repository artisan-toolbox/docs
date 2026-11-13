<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\FiloquentPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class FiloquentMiddlewarePage extends Page
{
    public const PageSlug SLUG = PageSlug::FiloquentMiddleware;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/filoquent/Middleware',
            title: 'Create upload middleware',
            description: 'Generate Filoquent upload middleware, register it on a file field, and prepare named assets safely.',
            sourcePath: 'resources/js/pages/docs/filoquent/Middleware.vue',
            package: new FiloquentPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\PermitPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class PermitAuthorizationPage extends Page
{
    public const PageSlug SLUG = PageSlug::PermitAuthorization;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/permit/Authorization',
            title: 'Protect application actions',
            description: 'Check permissions with Laravel Gates, Blade, and the Permit route middleware.',
            sourcePath: 'resources/js/pages/docs/permit/Authorization.vue',
            package: new PermitPackage,
        );
    }
}

<?php

namespace App\Documentation\Pages;

use App\Documentation\Packages\MosaicastPackage;
use App\Documentation\Page;
use App\Documentation\PageSlug;

final readonly class MosaicastSessionChannelsPage extends Page
{
    public const PageSlug SLUG = PageSlug::MosaicastSessionChannels;

    public function __construct()
    {
        parent::__construct(
            slug: self::SLUG,
            component: 'docs/mosaicast/SessionChannels',
            title: 'Session broadcast channels',
            description: 'Authorize a private Mosaicast channel from a Laravel session without requiring a signed-in user.',
            sourcePath: 'resources/js/pages/docs/mosaicast/SessionChannels.vue',
            package: new MosaicastPackage,
        );
    }
}

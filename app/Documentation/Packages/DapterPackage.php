<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class DapterPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'dapter',
            title: 'Dapter',
            summary: 'Read, filter, order, and invoke authorized actions through a headless Vue adapter.',
            version: null,
            overview: PageSlug::Dapter,
            documentedVersion: '1.x preview',
            stability: 'Work in progress',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Inertia Laravel 3.x',
                'Vue 3.5.40 or later within 3.x for the frontend adapter',
                'Inertia Vue and Core 3.0.3 or later within 3.x for the frontend adapter',
                'Ziggy 2.6.5 or later within 2.x for named routes',
                'Node.js 24.11.0 or later for frontend tooling',
            ],
        );
    }
}

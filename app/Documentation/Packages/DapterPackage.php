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
            summary: 'Prepare Laravel and Inertia data adapter integrations with a typed frontend foundation.',
            version: null,
            overview: PageSlug::Dapter,
            documentedVersion: '1.x preview',
            stability: 'Work in progress',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Inertia Laravel 3.x',
                'Node.js 24.11.0 or later for frontend tooling',
            ],
        );
    }
}

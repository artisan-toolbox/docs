<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class CorePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'core',
            title: 'Core',
            summary: 'Use focused Laravel helpers that do not need separate packages, including conditional arrays and translated attributes.',
            version: '1.x',
            overview: PageSlug::Core,
            documentedVersion: '1.2',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Inertia Laravel 3.x',
            ],
        );
    }
}

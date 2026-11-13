<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class FiloquentPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'filoquent',
            title: 'Filoquent',
            summary: 'Eloquent file attributes with upload variants, immutable storage paths, and indexed ownership tracking. Development preview.',
            version: null,
            overview: PageSlug::Filoquent,
            documentedVersion: '0.1.0-alpha.1',
            stability: 'Preview',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Composer and a reviewed Filoquent development checkout',
            ],
        );
    }
}

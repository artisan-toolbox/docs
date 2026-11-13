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
            summary: 'Eloquent file attributes with upload variants, immutable storage paths, and indexed ownership tracking.',
            version: null,
            overview: PageSlug::Filoquent,
            documentedVersion: '1.0.0-beta.3',
            stability: 'Beta',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Composer',
            ],
        );
    }
}

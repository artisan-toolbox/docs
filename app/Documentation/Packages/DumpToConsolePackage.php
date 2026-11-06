<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class DumpToConsolePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'dump-to-console',
            title: 'Dump to Console',
            summary: 'Send Laravel dumps to a separate console without changing the application response.',
            version: '1.x',
            overview: PageSlug::DumpToConsole,
            documentedVersion: '1.1',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
            ],
        );
    }
}

<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;

final readonly class DumpToConsolePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'dump-to-console',
            title: 'Dump to Console',
            summary: 'Send Laravel dumps to a separate console without changing the application response.',
            version: '1.x',
        );
    }
}

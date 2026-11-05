<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;

final readonly class CorePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'core',
            title: 'Core',
            summary: 'Build conditional arrays, translate model attributes, and share Laravel and Inertia utilities.',
            version: '1.x',
        );
    }
}

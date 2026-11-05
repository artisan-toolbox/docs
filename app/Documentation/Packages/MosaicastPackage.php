<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;

final readonly class MosaicastPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'mosaicast',
            title: 'Mosaicast',
            summary: 'Deliver Laravel events through Inertia props or a private session broadcast channel.',
            version: '1.x',
        );
    }
}

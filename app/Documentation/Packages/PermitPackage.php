<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class PermitPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'permit',
            title: 'Permit',
            summary: 'Declare roles and permissions, assign access to users, and authorize actions with Laravel Gates.',
            version: '1.x',
            overview: PageSlug::Permit,
            documentedVersion: '1.0.0-beta.5',
            stability: 'Beta',
            requirements: [
                'PHP 8.5 minimum within PHP 8.x (tested on PHP 8.5 and 8.6)',
                'PHP intl extension for locale-aware catalog order',
                'Laravel 13 with an Eloquent user provider',
                'Inertia Laravel 3.x',
                'Composer',
                'Vue 3.5, Inertia Vue 3.x, and Node.js ^20.19, ^22.18, or >=24.11 for the optional frontend',
            ],
        );
    }
}

<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class FrontAwesomePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'front-awesome',
            title: 'Front Awesome',
            summary: 'Use Web Awesome components, share branding, send toasts, and review print jobs.',
            version: null,
            overview: PageSlug::FrontAwesome,
            documentedVersion: '1.x',
            stability: 'Work in progress',
            requirements: [
                'PHP 8.5 or later within PHP 8.x, Laravel 13, and Inertia Laravel 3.x',
                'Vue 3.5 or later within Vue 3.x, Inertia Vue 3.x, and Tailwind CSS 4.x',
                'Mosaicast 1.1.1 or later within Mosaicast 1.x',
                'Node.js 24.11 or later',
            ],
        );
    }
}

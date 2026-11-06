<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class MosaicastPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'mosaicast',
            title: 'Mosaicast',
            summary: 'Deliver Laravel events through Inertia props or a private session broadcast channel.',
            version: '1.x',
            overview: PageSlug::Mosaicast,
            documentedVersion: '1.2',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'Laravel 13 components',
                'Inertia Laravel 3.x, installed through Core',
                'A Laravel web request with an active session for implicit dispatch',
                'Laravel broadcasting configured for the broadcast path; Reverb is one supported driver',
                'Node.js 20 or later, Vue 3, and @inertiajs/vue3 3.x for the JavaScript client',
            ],
        );
    }
}

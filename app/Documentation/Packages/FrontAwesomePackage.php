<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;

final readonly class FrontAwesomePackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'front-awesome',
            title: 'Front Awesome',
            summary: 'Use Web Awesome components, share Tailwind branding, and send toasts from Laravel or Vue.',
            version: null,
        );
    }
}

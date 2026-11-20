<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;
use App\Documentation\PageSlug;

final readonly class QzTrayPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'qztray',
            title: 'QZ Tray Connector',
            summary: 'Print through QZ Tray and preview ESC/POS receipts, ZPL labels, and PDFs.',
            version: '1.x',
            overview: PageSlug::QzTray,
            documentedVersion: '1.5.2',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 minimum within PHP 8.x (tested on PHP 8.5 and 8.6)',
                'PHP OpenSSL extension (ext-openssl, enforced by Composer)',
                'Laravel 13 components',
                'Composer installs Artisan Toolbox Core ^1.4.1 and Maintainer ^1.14.3 automatically.',
                'Ziggy 2.x (tightenco/ziggy in Laravel and ziggy-js in the frontend), with the connector\'s named routes available through a global Ziggy configuration',
                'Node.js 20.19 or later within 20.x, 22.18 or later within 22.x, or 24.11 and later for frontend installation',
                'QZ Tray installed and running on the user\'s computer for printing; SHA-512 signing requires QZ Tray 2.1 or later',
                'A modern browser supporting Fetch and Promises; preview engines additionally require canvas, WebAssembly, or module workers as documented below',
            ],
        );
    }
}

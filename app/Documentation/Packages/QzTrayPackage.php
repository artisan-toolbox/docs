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
            documentedVersion: '1.2',
            stability: 'Stable',
            requirements: [
                'PHP 8.5 or later within the PHP 8.x series',
                'PHP OpenSSL extension (ext-openssl, enforced by Composer)',
                'Laravel 13 components',
                'Artisan Toolbox Core 1.x',
                'Artisan Toolbox Maintainer 1.11 or later within 1.x. Composer installs Core and Maintainer automatically.',
                'Ziggy 2.x (tightenco/ziggy in Laravel and ziggy-js in the frontend), with the connector\'s named routes available through a global Ziggy configuration',
                'Node.js 20.19 or later within 20.x, 22.18 or later within 22.x, or 24.11 and later for frontend installation',
                'QZ Tray installed and running on the user\'s computer for printing; SHA-512 signing requires QZ Tray 2.1 or later',
                'A modern browser supporting Fetch and Promises; preview engines additionally require canvas, WebAssembly, or module workers as documented below',
            ],
        );
    }
}

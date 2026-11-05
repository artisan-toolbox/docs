<?php

namespace App\Documentation\Packages;

use App\Documentation\Package;

final readonly class QzTrayPackage extends Package
{
    public function __construct()
    {
        parent::__construct(
            id: 'qztray',
            title: 'QZ Tray Connector',
            summary: 'Print through QZ Tray and preview ESC/POS receipts, ZPL labels, and PDFs.',
            version: '1.x',
        );
    }
}

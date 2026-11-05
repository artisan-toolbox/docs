<?php

use Opcodes\LogViewer\Http\Middleware\AuthorizeLogViewer;

return [
    'route_path' => 'logs',
    'middleware' => ['web', 'auth', AuthorizeLogViewer::class],
    'api_middleware' => ['web', 'auth', AuthorizeLogViewer::class],
];

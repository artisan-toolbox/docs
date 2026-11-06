<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

final class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        return response("User-agent: *\nAllow: /\n\nSitemap: ".route('sitemap')."\n", headers: [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}

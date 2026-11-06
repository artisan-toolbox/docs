<?php

namespace App\Http\Controllers;

use App\Documentation\PageSlug;
use Illuminate\Http\Response;

final class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [route('home')];

        foreach (PageSlug::cases() as $slug) {
            $urls[] = $slug->url();
        }

        return response()->view('sitemap', ['urls' => $urls], headers: [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}

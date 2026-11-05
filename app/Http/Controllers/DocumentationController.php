<?php

namespace App\Http\Controllers;

use App\Documentation\Documentation;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Enums\OgType;
use Laravel\Head\Facades\Head;

final class DocumentationController extends Controller
{
    public function show(Documentation $documentation, string $slug = ''): Response
    {
        $page = $documentation->page($slug);
        $canonical = config()->string('documentation.url').'/docs'.($slug === '' ? '' : '/'.$slug);

        Head::title($page['title'])
            ->description($page['description'])
            ->canonical($canonical)
            ->og(type: OgType::Website, title: $page['title'], description: $page['description'], url: $canonical);

        return Inertia::render($page['component'], [
            'page' => $page,
            'navigation' => $documentation->navigation($slug),
            'packages' => $documentation->packages(),
        ]);
    }
}

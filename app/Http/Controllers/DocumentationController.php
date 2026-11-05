<?php

namespace App\Http\Controllers;

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use App\Http\Resources\Documentation\PackageResource;
use App\Http\Resources\Documentation\PageResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Enums\OgType;
use Laravel\Head\Facades\Head;

final class DocumentationController extends Controller
{
    public function show(Request $request, Documentation $documentation, PageSlug $slug = PageSlug::Index): Response
    {
        $page = $slug->page();
        $canonical = $slug->url();

        Head::title($page->title)
            ->description($page->description)
            ->canonical($canonical, forceHttps: false)
            ->og(type: OgType::Website, title: $page->title, description: $page->description, url: $canonical);

        return Inertia::render($page->component, [
            'page' => (new PageResource($page))->resolve($request),
            'navigation' => $documentation->navigation($slug),
            'packages' => PackageResource::collection($documentation->packages())->resolve($request),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\DataSources\FrontAwesome\Pressroom;
use App\Demo\Mosaicast\InertiaDelivery\DemoConfiguration;
use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use App\Http\Resources\Documentation\PackageResource;
use App\Http\Resources\Documentation\PageResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Enums\OgType;
use Laravel\Head\Facades\Head;
use Laravel\Head\Facades\Schema;

final class DocumentationController extends Controller
{
    public function show(Request $request, Documentation $documentation, PageSlug $slug = PageSlug::Index): Response
    {
        $page = $slug->page();
        $canonical = $slug->url();
        $breadcrumbs = Schema::breadcrumbs()->set('@id', $canonical.'#breadcrumb');

        foreach ($documentation->breadcrumbs($slug, absolute: true) as $crumb) {
            $breadcrumbs->item($crumb['label'], $crumb['href']);
        }

        Head::title($page->title)
            ->description($page->description)
            ->canonical($canonical, forceHttps: false)
            ->og(type: OgType::Website, title: $page->title, description: $page->description, url: $canonical)
            ->schema(Schema::webPage()
                ->set('@id', $canonical.'#webpage')
                ->name($page->title)
                ->description($page->description)
                ->url($canonical)
                ->set('isPartOf', ['@id' => route('home').'#website'])
                ->set('breadcrumb', ['@id' => $canonical.'#breadcrumb']))
            ->schema($breadcrumbs);

        $response = Inertia::render($page->component, [
            'page' => (new PageResource($page))->resolve($request),
            'navigation' => $documentation->navigation($slug),
            'packages' => PackageResource::collection($documentation->packages())->resolve($request),
            'links' => $documentation->links(),
        ]);

        if (in_array($slug, [PageSlug::FrontAwesomeDataView, PageSlug::FrontAwesomeDataViewLayouts], true)) {
            $response->with('pressroomPreview', (new Pressroom)->source()[0]);
        }

        if ($slug === PageSlug::MosaicastInertiaDelivery) {
            $response->with('mosaicastDemo', resolve(DemoConfiguration::class)->props($request));
        }

        if ($slug === PageSlug::DapterPostgresqlFullText) {
            $response->with('comparisonDemoEnabled', (bool) config('docs-dapter-comparisons.enabled'));
        }

        if (in_array($slug, [PageSlug::PermitManagement, PageSlug::FrontAwesomePermissionEditor], true)) {
            $response->with([
                'userPermissionEditor' => [
                    'version' => 1,
                    'endpoint' => route('demo.front-awesome.permission-editor.show', absolute: false),
                ],
                'permissionEditorDemoExport' => route('demo.front-awesome.permission-editor.export', absolute: false),
            ]);
        }

        return $response;
    }
}

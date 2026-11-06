<?php

namespace App\Http\Controllers;

use App\Documentation\Documentation;
use App\Http\Resources\Documentation\PackageResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Enums\OgType;
use Laravel\Head\Facades\Head;
use Laravel\Head\Facades\Schema;

final class HomeController extends Controller
{
    public function __invoke(Request $request, Documentation $documentation): Response
    {
        $title = 'Practical tools for Laravel';
        $description = 'Print receipts and labels, deliver events, debug requests, and maintain your projects with focused Laravel packages.';
        $canonical = route('home');

        Head::title($title)
            ->description($description)
            ->canonical($canonical, forceHttps: false)
            ->og(type: OgType::Website, title: $title, description: $description, url: $canonical)
            ->schema(Schema::organization()
                ->set('@id', $canonical.'#organization')
                ->name('Artisan Toolbox')
                ->url($canonical))
            ->schema(Schema::webSite()
                ->set('@id', $canonical.'#website')
                ->name('Artisan Toolbox')
                ->url($canonical)
                ->set('publisher', ['@id' => $canonical.'#organization']));

        return Inertia::render('Welcome', [
            'packages' => PackageResource::collection($documentation->packages())->resolve($request),
            'links' => $documentation->links(),
            'source' => [
                'sourceUrl' => config()->string('documentation.source_url').'/resources/js/pages/Welcome.vue',
                'sourceLabel' => 'View page source on GitHub',
            ],
        ]);
    }
}

<?php

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use Illuminate\Support\Facades\Route;
use Laravel\Head\Facades\Head;

function metadataDocument(string $html): DOMXPath
{
    $document = new DOMDocument;
    $document->loadHTML($html, LIBXML_NOERROR | LIBXML_NOWARNING);

    return new DOMXPath($document);
}

/** @return list<array<string, mixed>> */
function metadataSchemas(DOMXPath $xpath): array
{
    return array_map(
        fn (DOMNode $node): array => json_decode($node->textContent, true, flags: JSON_THROW_ON_ERROR),
        iterator_to_array($xpath->query('//head/script[@type="application/ld+json"]')),
    );
}

test('describes the site and organization in initial home HTML', function () {
    $this->withoutVite();
    $xpath = metadataDocument($this->get('https://untrusted.example/?tracking=ignored')->assertOk()->getContent());
    $home = route('home');

    expect(metadataSchemas($xpath))->toBe([
        [
            '@context' => 'https://schema.org', '@type' => 'Organization',
            '@id' => $home.'#organization', 'name' => 'Artisan Toolbox', 'url' => $home,
        ],
        [
            '@context' => 'https://schema.org', '@type' => 'WebSite',
            '@id' => $home.'#website', 'name' => 'Artisan Toolbox', 'url' => $home,
            'publisher' => ['@id' => $home.'#organization'],
        ],
    ]);
});

test('describes every registered page and its actual hierarchy before JavaScript', function (PageSlug $slug) {
    $this->withoutVite();
    $page = $slug->page();
    $canonical = $slug->url();
    $xpath = metadataDocument($this->get($canonical.'?utm_source=ignored')->assertOk()->getContent());
    $items = [];
    foreach (resolve(Documentation::class)->breadcrumbs($slug, absolute: true) as $index => $crumb) {
        $items[] = ['@type' => 'ListItem', 'position' => $index + 1, 'name' => $crumb['label'], 'item' => $crumb['href']];
    }

    expect($xpath->query('//head/link[@rel="canonical"]'))->toHaveCount(1)
        ->and($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toBe($canonical)
        ->and(metadataSchemas($xpath))->toBe([
            [
                '@context' => 'https://schema.org', '@type' => 'WebPage',
                '@id' => $canonical.'#webpage', 'name' => $page->title, 'description' => $page->description,
                'url' => $canonical, 'isPartOf' => ['@id' => route('home').'#website'],
                'breadcrumb' => ['@id' => $canonical.'#breadcrumb'],
            ],
            [
                '@context' => 'https://schema.org', '@type' => 'BreadcrumbList',
                '@id' => $canonical.'#breadcrumb', 'itemListElement' => $items,
            ],
        ]);
})->with(PageSlug::cases());

test('serves one complete social preview on the configured origin', function (string $path) {
    $this->withoutVite();
    $xpath = metadataDocument($this->get('https://untrusted.example'.$path.'?preview=1')->assertOk()->getContent());
    $origin = rtrim(config()->string('app.url'), '/');
    $description = $xpath->evaluate('string(//head/meta[@name="description"]/@content)');

    foreach (['og:type', 'og:title', 'og:description', 'og:url', 'og:site_name', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt'] as $property) {
        expect($xpath->query('//head/meta[@property="'.$property.'"]'))->toHaveCount(1);
    }
    foreach (['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'] as $name) {
        expect($xpath->query('//head/meta[@name="'.$name.'"]'))->toHaveCount(1);
    }
    expect($xpath->evaluate('string(//head/meta[@property="og:url"]/@content)'))->toBe($origin.($path === '/' ? '' : $path))
        ->and($xpath->evaluate('string(//head/meta[@property="og:description"]/@content)'))->toBe($description)
        ->and($xpath->evaluate('string(//head/meta[@name="twitter:description"]/@content)'))->toBe($description)
        ->and($xpath->evaluate('string(//head/meta[@name="twitter:card"]/@content)'))->toBe('summary_large_image')
        ->and($xpath->evaluate('string(//head/meta[@name="twitter:image"]/@content)'))->toBe($origin.'/images/brand/social-card.png')
        ->and($xpath->evaluate('string(//head/meta[@property="og:image:width"]/@content)'))->toBe('1200')
        ->and($xpath->evaluate('string(//head/meta[@property="og:image:height"]/@content)'))->toBe('630')
        ->and($xpath->evaluate('string(//head/meta[@name="twitter:image:alt"]/@content)'))->toBe('Artisan Toolbox');
})->with(['/', '/docs', '/docs/maintainer/ci/quality']);

test('uses renamed routes in schema identities and keeps sign in free of public schemas', function () {
    $this->withoutVite();
    Route::getRoutes()->getByName('home')->setUri('start');
    Route::getRoutes()->getByName('docs.index')->setUri('guides');
    Route::getRoutes()->getByName('docs.show')->setUri('guides/{slug}');
    $home = route('home');
    $canonical = PageSlug::CoreInstallation->url();

    $schemas = metadataSchemas(metadataDocument($this->get($canonical)->assertOk()->getContent()));
    expect($schemas[0]['@id'])->toBe($canonical.'#webpage')
        ->and($schemas[0]['isPartOf'])->toBe(['@id' => $home.'#website'])
        ->and(array_column($schemas[1]['itemListElement'], 'item'))->toBe([
            $home, route('docs.index'), PageSlug::Core->url(), $canonical,
        ]);
});

test('keeps initial sign in HTML free of public schemas', function () {
    $this->withoutVite();
    $xpath = metadataDocument($this->get('/login')->assertOk()->assertHeader('X-Robots-Tag', 'noindex, nofollow')->getContent());
    expect(metadataSchemas($xpath))->toBe([])
        ->and($xpath->evaluate('string(//head/meta[@name="robots"]/@content)'))->toBe('noindex, nofollow');
});

test('delivers only destination schemas in Inertia navigation responses', function () {
    $this->withoutVite();
    $initial = $this->get('/')->assertOk();
    $headers = ['X-Inertia' => 'true', 'X-Inertia-Version' => $initial->viewData('page')['version']];

    // Feature requests share a container; real HTTP requests receive a fresh scoped head.
    Head::flush();
    $response = $this->get('/docs/core/installation', $headers)->assertOk();
    $xpath = metadataDocument('<html><head>'.implode('', $response->json('props.head')).'</head></html>');
    expect(array_column(metadataSchemas($xpath), '@type'))->toBe(['WebPage', 'BreadcrumbList']);
    Head::flush();
    $response = $this->get('/login', $headers)->assertOk();
    $xpath = metadataDocument('<html><head>'.implode('', $response->json('props.head')).'</head></html>');
    expect(metadataSchemas($xpath))->toBe([]);
});

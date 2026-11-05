<?php

use App\Documentation\PageSlug;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('lists all six packages while linking only migrated content to new routes', function () {
    $this->withoutVite();

    $this->get('/docs')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/Index')
        ->where('page.title', 'Documentation')
        ->where('page.package', null)
        ->has('packages', 6)
        ->where('packages.2.id', 'front-awesome')
        ->where('packages.2.version', null)
        ->where('packages.3.href', '/docs/maintainer')
        ->where('packages.3.migrated', true)
        ->where('packages.0.href', 'https://artisantoolbox.wsssoftware.com.br/packages/core/')
        ->where('packages.0.migrated', false)
    );
});

test('serves the documented Maintainer version and consumer requirements', function () {
    $this->withoutVite();

    $this->get('/docs/maintainer')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/maintainer/Maintainer')
        ->where('page.title', 'Maintainer')
        ->where('page.package.composerName', 'artisan-toolbox/maintainer')
        ->where('page.package.documentedVersion', '1.10')
        ->where('page.requirements', [
            'PHP 8.5 or later within the PHP 8.x series',
            'Composer',
            'Git',
            'GitHub CLI for workflows that interact with GitHub',
        ])
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/src/content/docs/packages/maintainer/index.md')
        ->where('page.sourceLabel', 'View migration source on GitHub')
        ->where('navigation.0.active', false)
        ->where('navigation.1.active', true)
    );
});

test('puts unique metadata and browser icons in the initial HTML without Vue SSR', function () {
    $this->withoutVite();

    $response = $this->get('/docs/maintainer?utm_source=preview')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/title)'))->toBe('Maintainer - Artisan Toolbox');
    expect($xpath->query('//head/title'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toBe('Automated validation, quality assurance, versioning, and release workflows.');
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/docs/maintainer');
    expect($xpath->query('//head/link[@rel="canonical"]'))->toHaveCount(1);
    expect($xpath->query('//head/meta[@name="viewport"]'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/link[@rel="icon" and @sizes="96x96"]/@href)'))
        ->toEndWith('/favicons/favicon-96x96.png');
    expect($xpath->evaluate('string(//head/link[@rel="apple-touch-icon"]/@href)'))
        ->toEndWith('/favicons/apple-touch-icon.png');
    expect($xpath->evaluate('string(//head/link[@rel="manifest"]/@href)'))
        ->toEndWith('/favicons/site.webmanifest');
    expect($xpath->evaluate('string(//head/meta[@property="og:title"]/@content)'))->toBe('Maintainer');
    expect($xpath->evaluate('string(//head/meta[@name="twitter:card"]/@content)'))->toBe('summary_large_image');
});

test('shares destination head metadata for Inertia navigation', function () {
    $this->withoutVite();
    $initial = $this->get('/docs')->assertOk();

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $initial->viewData('page')['version'],
    ])->get('/docs/maintainer');

    $response->assertOk()->assertJsonPath('component', 'docs/maintainer/Maintainer');
    expect(implode('', $response->json('props.head')))
        ->toContain('Maintainer - Artisan Toolbox', 'rel="canonical"')
        ->not->toContain('rel="icon"', 'name="viewport"');
});

test('returns 404 for documentation that has no registered page', function (string $path) {
    $this->get($path)->assertNotFound();
})->with(['/docs/unknown', '/docs/maintainer/unknown', '/docs/core', '/docs/app/Providers/AppServiceProvider.php']);

test('redirects the migrated legacy overview without redirecting unmigrated guides', function () {
    $this->get('/packages/maintainer')->assertStatus(301)->assertRedirect('/docs/maintainer');
    $this->get('/packages/maintainer/ci')->assertNotFound();
});

test('redirects conventional icon requests to the dedicated favicon directory', function (string $filename) {
    $this->get('/'.$filename)->assertStatus(301)->assertRedirect('/favicons/'.$filename);
})->with(['favicon.ico', 'apple-touch-icon.png']);

test('keeps canonical and social URLs on APP_URL when the request uses a different origin', function () {
    $this->withoutVite();
    $appUrl = rtrim(config()->string('app.url'), '/');
    $requestScheme = str_starts_with($appUrl, 'https://') ? 'http' : 'https';

    $response = $this->get($requestScheme.'://different-origin.example:8443/docs/maintainer?utm_source=test')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe($appUrl.'/docs/maintainer');
    expect($xpath->evaluate('string(//head/meta[@property="og:url"]/@content)'))
        ->toBe($appUrl.'/docs/maintainer');
    expect($xpath->evaluate('string(//head/meta[@property="og:image"]/@content)'))
        ->toBe($appUrl.'/images/brand/social-card.png');
});

test('serves every declared documentation page without wrapping its frontend props', function () {
    $this->withoutVite();

    foreach (PageSlug::cases() as $slug) {
        $page = $slug->page();

        expect($page->slug)->toBe($slug);
        expect(resource_path('js/pages/'.$page->component.'.vue'))->toBeFile();

        $this->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $response) => $response
            ->component($page->component)
            ->where('page.slug', $slug->value)
            ->where('page.title', $page->title)
            ->missing('page.data')
            ->missing('packages.data')
        );
    }
});

test('follows the named documentation route when its path changes', function () {
    $this->withoutVite();
    Route::getRoutes()->getByName('docs.show')->setUri('/reference/{slug}');

    $response = $this->get('/reference/maintainer?utm_source=test')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))
        ->toBe(rtrim(config()->string('app.url'), '/').'/reference/maintainer');
    $response->assertInertia(fn (Assert $page) => $page
        ->where('navigation.1.href', '/reference/maintainer')
        ->where('packages.3.href', '/reference/maintainer')
    );
});

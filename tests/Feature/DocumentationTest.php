<?php

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
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/main/src/content/docs/packages/maintainer/index.md')
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
        ->toBe('https://artisantoolbox.wsssoftware.com.br/docs/maintainer');
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

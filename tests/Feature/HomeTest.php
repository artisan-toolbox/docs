<?php

use Composer\InstalledVersions;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('lists packages alphabetically across public catalogs', function (string $path) {
    $this->withoutVite();

    $this->get($path)->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('packages', fn (Collection $packages): bool => $packages->pluck('title')->all() === [
            'Core',
            'Dump to Console',
            'Filoquent',
            'Front Awesome',
            'Maintainer',
            'Mosaicast',
            'QZ Tray Connector',
        ])

    );
})->with(['/', '/docs', '/docs/getting-started/choose-a-package']);

test('serves the complete package catalog and public navigation on the home page', function () {
    $this->withoutVite();

    $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('Welcome')
        ->has('packages', 7)
        ->where('source.sourceUrl', config()->string('documentation.source_url').'/resources/js/pages/Welcome.vue')
        ->where('source.sourceLabel', 'View page source on GitHub')
        ->where('packages.0.id', 'core')
        ->where('packages.0.href', '/docs/core')
        ->where('packages.1.id', 'dump-to-console')
        ->where('packages.2.id', 'filoquent')
        ->where('packages.3.id', 'front-awesome')
        ->where('packages.3.version', null)
        ->where('packages.3.stability', 'Work in progress')
        ->where('packages.4.id', 'maintainer')
        ->where('packages.5.id', 'mosaicast')
        ->where('packages.6.id', 'qztray')
        ->where('links', [
            'home' => '/',
            'docs' => '/docs',
            'search' => '/docs/search',
            'github' => 'https://github.com/artisan-toolbox',
            'contact' => 'mailto:contact@atb.dev.br',
        ])
        ->missing('packages.data')
    );
});

test('uses installed Composer metadata in both package catalogs', function (string $path) {
    $this->withoutVite();
    $coreVersion = InstalledVersions::getPrettyVersion('artisan-toolbox/core');
    $mosaicastVersion = InstalledVersions::getPrettyVersion('artisan-toolbox/mosaicast');
    $coreVersion = in_array($coreVersion, ['1.99.99', '1.999.999'], true) ? '1.x-dev' : $coreVersion;
    $mosaicastVersion = in_array($mosaicastVersion, ['1.99.99', '1.999.999'], true) ? '1.x-dev' : $mosaicastVersion;

    $this->get($path)->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('packages.0.id', 'core')
        ->where('packages.0.installedVersion', $coreVersion)
        ->where('packages.0.repositoryUrl', 'https://github.com/artisan-toolbox/core')
        ->where('packages.5.id', 'mosaicast')
        ->where('packages.5.installedVersion', $mosaicastVersion)
    );
})->with(['/', '/docs/getting-started/choose-a-package']);

test('renders unique home metadata and icons in initial HTML on the configured origin', function (string $requestOrigin) {
    $this->withoutVite();
    $appUrl = rtrim(config()->string('app.url'), '/');
    $requestUrl = $requestOrigin === 'configured' ? $appUrl : 'https://different-origin.example:8443';
    $response = $this->get($requestUrl.'/?utm_source=preview')->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);

    expect($xpath->query('//head/title'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/title)'))->toBe('Practical tools for Laravel - Artisan Toolbox');
    expect($xpath->query('//head/meta[@name="description"]'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/meta[@name="description"]/@content)'))
        ->toBe('Print receipts and labels, deliver events, debug requests, and maintain your projects with focused Laravel packages.');
    expect($xpath->query('//head/link[@rel="canonical"]'))->toHaveCount(1);
    expect($xpath->evaluate('string(//head/link[@rel="canonical"]/@href)'))->toBe($appUrl.'/');
    expect($xpath->evaluate('string(//head/meta[@property="og:type"]/@content)'))->toBe('website');
    expect($xpath->evaluate('string(//head/meta[@property="og:title"]/@content)'))->toBe('Practical tools for Laravel');
    expect($xpath->evaluate('string(//head/meta[@property="og:url"]/@content)'))->toBe($appUrl);
    expect($xpath->evaluate('string(//head/meta[@property="og:image"]/@content)'))->toBe($appUrl.'/images/brand/social-card.png');
    expect($xpath->evaluate('string(//head/link[@rel="icon" and @sizes="96x96"]/@href)'))->toEndWith('/favicons/favicon-96x96.png');
    expect($xpath->evaluate('string(//head/link[@rel="apple-touch-icon"]/@href)'))->toEndWith('/favicons/apple-touch-icon.png');
    expect($xpath->evaluate('string(//head/link[@rel="manifest"]/@href)'))->toEndWith('/favicons/site.webmanifest');
})->with(['configured', 'different']);

test('follows named home and documentation routes for shared navigation and canonical metadata', function () {
    $this->withoutVite();
    Route::getRoutes()->getByName('home')->setUri('/start');
    Route::getRoutes()->getByName('docs.index')->setUri('/reference');
    Route::getRoutes()->getByName('docs.show')->setUri('/reference/{slug}');

    $response = $this->get('/start')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('links.home', '/start')
        ->where('links.docs', '/reference')
        ->where('packages.0.href', '/reference/core')
    );
    $response->assertSee('href="'.rtrim(config()->string('app.url'), '/').'/start"', escape: false);
    $this->get('/reference')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('links.home', '/start')
        ->where('links.docs', '/reference')
    );
});

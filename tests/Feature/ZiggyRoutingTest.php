<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Testing\TestResponse;
use Tighten\Ziggy\Ziggy;

beforeEach(fn () => Ziggy::clearRoutes());
afterEach(fn () => Ziggy::clearRoutes());

/** @return array<string, mixed> */
function renderedZiggyConfiguration(TestResponse $response): array
{
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $scripts = (new DOMXPath($document))->query('//head/script[@id="ziggy-routes-json" and @type="application/json"]');
    expect($scripts)->toHaveCount(1);

    return json_decode($scripts->item(0)->textContent, true, flags: JSON_THROW_ON_ERROR);
}

test('publishes one filtered native Ziggy configuration on initial application documents', function (string $path) {
    $this->withoutVite();
    Route::get('/internal/diagnostics', fn () => 'Internal')->name('internal.diagnostics');

    $configuration = renderedZiggyConfiguration($this->get($path)->assertOk());

    expect($configuration['url'])->toBe(rtrim(config()->string('app.url'), '/'))
        ->and($configuration)->not->toHaveKey('location')
        ->and($configuration['routes'])->toHaveKeys([
            'home', 'docs.index', 'docs.show', 'docs.search',
            'login', 'login.email', 'login.store', 'logout', 'log-viewer.index',
            'demo.mosaicast.delivery', 'demo.mosaicast.queue',
            'demo.core.conditional-arrays',
            'qztray_connector.get_public_key', 'qztray_connector.sign_payload',
        ])
        ->and($configuration['routes'])->not->toHaveKeys(['internal.diagnostics', 'horizon.index', 'broadcasting.auth'])
        ->and($configuration['routes']['login.email']['methods'])->toBe(['POST'])
        ->and($configuration['routes']['login.store']['methods'])->toBe(['POST'])
        ->and($configuration['routes']['logout']['methods'])->toBe(['POST'])
        ->and($configuration['routes']['demo.core.conditional-arrays']['methods'])->toBe(['POST'])
        ->and($configuration['routes']['log-viewer.index']['uri'])->toBe('logs/{view?}')
        ->and($configuration['routes']['docs.show']['wheres']['slug'])->toBe('[a-z0-9-]+(?:/[a-z0-9-]+)*');
})->with(['/', '/docs', '/login']);

test('exports changed named route paths without generating a frontend file', function () {
    $this->withoutVite();
    Route::getRoutes()->getByName('docs.index')->setUri('guides');
    Route::getRoutes()->getByName('login.email')->setUri('staff/code');
    Route::getRoutes()->getByName('login.store')->setUri('staff/access');
    Route::getRoutes()->getByName('logout')->setUri('staff/sign-out');
    Route::getRoutes()->getByName('demo.core.conditional-arrays')->setUri('examples/conditional-arrays');
    Route::getRoutes()->getByName('log-viewer.index')->setUri('staff/logs/{view?}');

    $configuration = renderedZiggyConfiguration($this->get('/')->assertOk());
    expect($configuration['routes']['docs.index']['uri'])->toBe('guides')
        ->and($configuration['routes']['login.email']['uri'])->toBe('staff/code')
        ->and($configuration['routes']['login.store']['uri'])->toBe('staff/access')
        ->and($configuration['routes']['logout']['uri'])->toBe('staff/sign-out')
        ->and($configuration['routes']['demo.core.conditional-arrays']['uri'])->toBe('examples/conditional-arrays')
        ->and($configuration['routes']['log-viewer.index']['uri'])->toBe('staff/logs/{view?}');
});

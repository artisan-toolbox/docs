<?php

use App\Documentation\PageSlug;
use App\Models\User;
use Illuminate\Support\Facades\Route;

test('lists only the canonical home and every registered documentation page once', function () {
    $response = $this->get('http://untrusted-origin.example/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8');

    $document = new DOMDocument;
    expect($document->loadXML($response->getContent()))->toBeTrue();
    $xpath = new DOMXPath($document);
    $xpath->registerNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    $urls = array_map(fn (DOMNode $node): string => $node->textContent, iterator_to_array($xpath->query('/s:urlset/s:url/s:loc')));
    $origin = rtrim(config()->string('app.url'), '/');
    $expected = [$origin];
    foreach (PageSlug::cases() as $slug) {
        $expected[] = $origin.'/docs'.($slug === PageSlug::Index ? '' : '/'.$slug->value);
    }

    expect($urls)->toBe($expected)
        ->and(array_unique($urls))->toHaveCount(count($expected))
        ->and($xpath->query('/s:urlset/s:url/*[not(self::s:loc)]'))->toHaveCount(0);
});

test('uses changed named paths and escapes sitemap URLs as XML', function () {
    Route::getRoutes()->getByName('home')->setUri('welcome&hello');
    Route::getRoutes()->getByName('docs.index')->setUri('guides');
    Route::getRoutes()->getByName('docs.show')->setUri('guides/{slug}');

    $response = $this->get('/sitemap.xml')->assertOk();

    $document = new DOMDocument;
    expect($document->loadXML($response->getContent()))->toBeTrue();
    $origin = rtrim(config()->string('app.url'), '/');
    $response->assertSee('<loc>'.$origin.'/welcome&amp;hello</loc>', escape: false)
        ->assertSee('<loc>'.$origin.'/guides</loc>', escape: false)
        ->assertSee('<loc>'.$origin.'/guides/core</loc>', escape: false)
        ->assertDontSee('<loc>'.$origin.'/docs', escape: false);
});

test('advertises the named canonical sitemap while allowing documentation and rendering assets', function () {
    Route::getRoutes()->getByName('sitemap')->setUri('discovery/map.xml');

    $this->get('http://untrusted-origin.example/robots.txt')
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
        ->assertContent("User-agent: *\nAllow: /\n\nSitemap: ".rtrim(config()->string('app.url'), '/')."/discovery/map.xml\n");

    expect(file_exists(public_path('robots.txt')))->toBeFalse();
});

test('keeps internal browser responses out of the index including authentication redirects', function (string $path, int $status) {
    $this->withoutVite();

    $this->get($path)->assertStatus($status)->assertHeader('X-Robots-Tag', 'noindex, nofollow');
})->with([
    'sign in' => ['/login', 200],
    'Horizon sign in redirect' => ['/horizon', 302],
    'log viewer sign in redirect' => ['/logs', 302],
    'search validation' => ['/docs/search?q=a', 422],
]);

test('keeps rendered internal authorization errors out of the index', function (string $path) {
    $this->actingAs(User::factory()->create(['email' => 'outsider@example.com']));

    $this->getJson($path)->assertForbidden()->assertHeader('X-Robots-Tag', 'noindex, nofollow');
})->with(['/horizon/api/stats', '/logs/api/hosts']);

test('keeps internal API authentication and demo validation responses out of the index', function () {
    $this->getJson('/horizon/api/stats')->assertUnauthorized()->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    $this->postJson('/demo/mosaicast/queue')->assertUnauthorized()->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    $this->postJson('/demo/mosaicast/delivery')->assertUnprocessable()->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

test('keeps authentication and connector API failures out of the index', function (string $path, int $status) {
    $this->postJson($path)->assertStatus($status)->assertHeader('X-Robots-Tag', 'noindex, nofollow');
})->with([
    'email validation' => ['/login/email', 422],
    'sign in validation' => ['/login', 422],
    'sign out authentication' => ['/logout', 401],
    'connector authentication' => ['/qztray-connector/sign-payload', 401],
]);

test('keeps successful staff dashboards out of the index', function (string $path) {
    $this->actingAs(User::factory()->create(['email' => 'staff@atb.dev.br']));

    $this->get($path)->assertOk()->assertHeader('X-Robots-Tag', 'noindex, nofollow');
})->with(['/horizon', '/logs']);

test('follows configured admin route paths without matching similar public paths', function () {
    Route::getRoutes()->getByName('horizon.index')->setUri('staff/queues/{view?}');
    Route::getRoutes()->getByName('log-viewer.index')->setUri('staff/logs/{view?}');
    Route::get('/logs-about', fn (): string => 'Public logging guide')->name('public.logs');

    $this->get('/staff/queues')->assertRedirect('/login')->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    $this->get('/staff/logs')->assertRedirect('/login')->assertHeader('X-Robots-Tag', 'noindex, nofollow');
    $this->get('/logs-about')->assertOk()->assertHeaderMissing('X-Robots-Tag');
});

test('does not add noindex to public pages or discovery endpoints', function (string $path) {
    $this->withoutVite();

    $this->get($path)->assertOk()->assertHeaderMissing('X-Robots-Tag');
})->with(['/', '/docs', '/docs/core', '/robots.txt', '/sitemap.xml']);

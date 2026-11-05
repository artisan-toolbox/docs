<?php

use Illuminate\Support\Facades\Http;

test('serves the initial Inertia document without contacting an SSR server', function () {
    $this->withoutVite();
    config([
        'inertia.ssr.ensure_bundle_exists' => false,
        'inertia.ssr.hot_url' => 'http://127.0.0.1:5173',
    ]);
    Http::preventStrayRequests();
    Http::fake([
        'http://127.0.0.1:13714/render' => Http::response([
            'head' => [],
            'body' => '<div>Unexpected server render</div>',
        ]),
        'http://127.0.0.1:5173/__inertia_ssr' => Http::response([
            'head' => [],
            'body' => '<div>Unexpected server render</div>',
        ]),
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertDontSee('Unexpected server render');

    Http::assertNothingSent();
});

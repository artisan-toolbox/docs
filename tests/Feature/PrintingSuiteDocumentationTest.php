<?php

use App\Documentation\InstallationCommands;
use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('serves the print suite guides through the owning registry', function (PageSlug $slug, string $component) {
    $this->withoutVite()->get($slug->url(absolute: false))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component)->where('page.slug', $slug->value));
    expect(base_path($slug->page()->sourcePath))->toBeFile();
})->with([
    [PageSlug::FrontAwesomePrinting, 'docs/front-awesome/Printing'],
    [PageSlug::FrontAwesomePrintingReference, 'docs/front-awesome/PrintingReference'],
    [PageSlug::QzTrayEscposWriter, 'docs/qztray/EscposWriter'],
]);

test('generates complete synthetic documents on demand without a printer connection', function () {
    $response = $this->postJson(route('demo.front-awesome.printing.documents'));
    $response->assertOk()->assertHeader('Cache-Control', 'no-store, private')
        ->assertExactJsonStructure(['receipt', 'invoice', 'labels']);

    $receipt = base64_decode($response->json('receipt'), strict: true);
    $pdf = base64_decode($response->json('invoice'), strict: true);
    expect($receipt)->toStartWith("\x1b@")->toContain('Artisan Toolbox', 'Coffee beans', '18.00');
    expect($pdf)->toStartWith('%PDF-1.4')->toContain('/Count 2', 'Invoice ATB-1001', 'Packing list ATB-1001');
    expect($response->json('labels'))->toStartWith('^XA')->toEndWith('^XZ')->toContain('ATB-1001');
});

test('keeps optional printing installation commands tied to installed versions', function () {
    $catalog = resolve(InstallationCommands::class);
    expect($catalog->forPackage('qztray')['escpos']['code'])
        ->toBe('composer require mike42/escpos-php:'.InstallationCommands::composerVersion('mike42/escpos-php'));
    expect($catalog->forPackage('front-awesome')['printing']['code'])
        ->toStartWith('composer require artisan-toolbox/qztray:'.InstallationCommands::composerVersion('artisan-toolbox/qztray'))
        ->toContain("\nnpm install --install-links ./vendor/artisan-toolbox/front-awesome ./vendor/artisan-toolbox/mosaicast ./vendor/artisan-toolbox/qztray");
});

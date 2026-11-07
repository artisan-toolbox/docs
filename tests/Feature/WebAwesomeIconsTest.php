<?php

test('shares the configured public Font Awesome kit with its script and native WA integration', function (string $path) {
    $this->withoutVite();
    config(['documentation.fontawesome_kit_code' => 'public-kit-example']);
    $response = $this->get($path)->assertOk();
    $document = new DOMDocument;
    $document->loadHTML($response->getContent(), LIBXML_NOERROR | LIBXML_NOWARNING);
    $xpath = new DOMXPath($document);
    expect($xpath->evaluate('string(/html/@data-fa-kit-code)'))->toBe('public-kit-example');
    $scripts = $xpath->query('//head/script[starts-with(@src, "https://kit.fontawesome.com/")]');
    expect($scripts)->toHaveCount(1)
        ->and($scripts->item(0)->getAttribute('src'))->toBe('https://kit.fontawesome.com/public-kit-example.js')
        ->and($scripts->item(0)->getAttribute('crossorigin'))->toBe('anonymous')
        ->and($scripts->item(0)->hasAttribute('defer'))->toBeTrue()
        ->and($scripts->item(0)->hasAttribute('async'))->toBeFalse();
})->with(['/', '/docs', '/login']);

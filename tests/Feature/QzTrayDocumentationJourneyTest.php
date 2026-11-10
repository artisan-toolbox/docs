<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('orders QZ Tray documentation by prerequisites and serves each guide with its actual source', function () {
    $this->withoutVite();
    $journey = [
        'qztray',
        'qztray/installation',
        'qztray/security',
        'qztray/connection',
        'qztray/printing',
        'qztray/escpos-writer',
        'qztray/escpos-previews',
        'qztray/zpl-previews',
        'qztray/pdf-previews',
        'qztray/compatibility',
        'qztray/frontend-tooling',
        'qztray/development',
    ];

    expect(array_values(array_map(
        fn (PageSlug $slug): string => $slug->value,
        array_filter(PageSlug::cases(), fn (PageSlug $slug): bool => str_starts_with($slug->value, 'qztray')),
    )))->toBe($journey);

    foreach ($journey as $value) {
        $slug = PageSlug::from($value);
        $page = $slug->page();

        expect(base_path($page->sourcePath))->toBeFile();
        $this->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $response) => $response
            ->component($page->component)
            ->where('page.slug', $value)
            ->where('page.title', $page->title)
            ->where('page.package.id', 'qztray')
        );
        $this->get('/packages/'.$value)->assertStatus(301)->assertRedirect($slug->url(absolute: false));
    }
});

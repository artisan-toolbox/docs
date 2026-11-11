<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('serves localization guides with canonical registry metadata', function (PageSlug $slug, string $component) {
    $this->withoutVite()->get($slug->url(absolute: false))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component)
            ->where('page.slug', $slug->value)
            ->where('page.package.id', 'front-awesome')
            ->where('page.requirements.0', 'PHP 8.5 or later within PHP 8.x, Laravel 13.36 or later within Laravel 13.x, and Inertia Laravel 3.x'));

    expect(base_path($slug->page()->sourcePath))->toBeFile();
})->with([
    [PageSlug::FrontAwesomeLocalization, 'docs/front-awesome/Localization'],
    [PageSlug::FrontAwesomeLocalizationReference, 'docs/front-awesome/LocalizationReference'],
]);

test('keeps localization reference beneath its how-to and after setup', function () {
    expect(PageSlug::FrontAwesomeLocalization->parent())->toBe(PageSlug::FrontAwesome)
        ->and(PageSlug::FrontAwesomeLocalizationReference->parent())->toBe(PageSlug::FrontAwesomeLocalization);

    $slugs = PageSlug::cases();
    expect(array_search(PageSlug::FrontAwesomeSetup, $slugs))->toBeLessThan(array_search(PageSlug::FrontAwesomeLocalization, $slugs))
        ->and(array_search(PageSlug::FrontAwesomeLocalization, $slugs))->toBeLessThan(array_search(PageSlug::FrontAwesomePrinting, $slugs));
});

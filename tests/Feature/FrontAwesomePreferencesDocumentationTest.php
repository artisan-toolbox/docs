<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('serves preference setup, task guides, and reference with canonical metadata', function (PageSlug $slug, string $component) {
    $this->withoutVite()->get($slug->url(absolute: false))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component)
            ->where('page.slug', $slug->value)
            ->where('page.package.id', 'front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/'.$slug->page()->sourcePath));

    expect(base_path($slug->page()->sourcePath))->toBeFile();
})->with([
    [PageSlug::FrontAwesomePreferences, 'docs/front-awesome/Preferences'],
    [PageSlug::FrontAwesomePreferencesAppearance, 'docs/front-awesome/preferences/Appearance'],
    [PageSlug::FrontAwesomePreferencesLanguage, 'docs/front-awesome/preferences/Language'],
    [PageSlug::FrontAwesomePreferencesTimezone, 'docs/front-awesome/preferences/Timezone'],
    [PageSlug::FrontAwesomePreferencesCurrency, 'docs/front-awesome/preferences/Currency'],
    [PageSlug::FrontAwesomePreferencesReference, 'docs/front-awesome/PreferencesReference'],
]);

test('groups the preference tasks before their reference beneath common setup', function () {
    $children = array_values(array_filter(PageSlug::cases(), fn (PageSlug $slug) => $slug->parent() === PageSlug::FrontAwesomePreferences));

    expect($children)->toBe([
        PageSlug::FrontAwesomePreferencesAppearance,
        PageSlug::FrontAwesomePreferencesLanguage,
        PageSlug::FrontAwesomePreferencesTimezone,
        PageSlug::FrontAwesomePreferencesCurrency,
        PageSlug::FrontAwesomePreferencesReference,
    ]);

    $slugs = PageSlug::cases();
    expect(array_search(PageSlug::FrontAwesomePreferences, $slugs))->toBeGreaterThan(array_search(PageSlug::FrontAwesomeSetup, $slugs));
});

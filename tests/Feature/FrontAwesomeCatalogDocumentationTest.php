<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

it('serves each component catalog page with its package and source metadata', function (PageSlug $slug, string $component, string $title) {
    $this->withoutVite()->get(route('docs.show', ['slug' => $slug->value]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/front-awesome/web-awesome/components/'.$component)
            ->where('page.slug', $slug->value)
            ->where('page.title', $title)
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/web-awesome/components/'.$component.'.vue')
        );
})->with([
    [PageSlug::FrontAwesomeComponents, 'Index', 'Vue components'],
    [PageSlug::FrontAwesomeActions, 'Actions', 'Actions'],
    [PageSlug::FrontAwesomeForms, 'Forms', 'Forms'],
    [PageSlug::FrontAwesomeLayout, 'Layout', 'Layout'],
    [PageSlug::FrontAwesomeNavigation, 'Navigation', 'Navigation'],
    [PageSlug::FrontAwesomeFeedback, 'Feedback', 'Feedback'],
    [PageSlug::FrontAwesomeMedia, 'Media', 'Media'],
    [PageSlug::FrontAwesomeDataViz, 'DataViz', 'Data Viz'],
    [PageSlug::FrontAwesomeHelpers, 'Helpers', 'Helpers'],
]);

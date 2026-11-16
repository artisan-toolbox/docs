<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

it('serves the DataView laboratory under Front Awesome development', function () {
    $slug = PageSlug::FrontAwesomeDataViewLab;

    $this->withoutVite()->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('docs/front-awesome/DataViewLab')
        ->where('page.title', 'DataView laboratory')
        ->where('page.slug', 'front-awesome/development/data-view')
        ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
        ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/DataViewLab.vue')
        ->where('page.breadcrumbs.3.href', '/docs/front-awesome/development')
        ->where('page.breadcrumbs.4.current', true));
});

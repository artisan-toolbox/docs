<?php

use Inertia\Testing\AssertableInertia as Assert;

test('serves the icon guide with package metadata and its source destination', function () {
    $this->withoutVite()->get('/docs/front-awesome/icon')->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/front-awesome/Icon')
            ->where('page.slug', 'front-awesome/icon')
            ->where('page.title', 'Render icons with Web Awesome')
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/Icon.vue')
        );
});

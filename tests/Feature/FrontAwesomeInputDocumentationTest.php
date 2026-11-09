<?php

use Inertia\Testing\AssertableInertia as Assert;

test('serves the input guide with package metadata and its source destination', function () {
    $this->withoutVite()->get('/docs/front-awesome/input')->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/front-awesome/Input')
            ->where('page.slug', 'front-awesome/input')
            ->where('page.title', 'Bind input values and form errors')
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/Input.vue')
        );
});

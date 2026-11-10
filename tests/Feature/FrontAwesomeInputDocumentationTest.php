<?php

use Inertia\Testing\AssertableInertia as Assert;

test('serves the canonical forms guide with package metadata and its source destination', function () {
    $this->withoutVite()->get('/docs/front-awesome/web-awesome/components/forms')->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/front-awesome/web-awesome/components/Forms')
            ->where('page.slug', 'front-awesome/web-awesome/components/forms')
            ->where('page.title', 'Forms')
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/web-awesome/components/Forms.vue')
        );
});

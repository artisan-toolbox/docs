<?php

use Inertia\Testing\AssertableInertia as Assert;

test('serves the canonical media reference with package metadata and its source destination', function () {
    $this->withoutVite()->get('/docs/front-awesome/web-awesome/components/media')->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('docs/front-awesome/web-awesome/components/Media')
            ->where('page.slug', 'front-awesome/web-awesome/components/media')
            ->where('page.title', 'Media')
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/resources/js/pages/docs/front-awesome/web-awesome/components/Media.vue')
        );
});

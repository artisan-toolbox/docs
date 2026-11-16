<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('preserves historical roadmap fragments through registered specialized destinations', function () {
    $destinations = PageSlug::DapterRoadmap->page()->fragmentDestinations();
    expect($destinations)->toHaveCount(40);
    foreach ($destinations as $fragment => $slug) {
        expect($slug->parent())->toBe(PageSlug::DapterDesign);
        expect(file_get_contents(base_path($slug->page()->sourcePath)))->toContain('id="'.$fragment.'"');
    }
    $this->withoutVite()->get(PageSlug::DapterRoadmap->url())
        ->assertOk()->assertInertia(fn (Assert $page) => $page
        ->where('page.fragmentDestinations.store-options', PageSlug::DapterDesignDeclarations->url().'#store-options')
        ->where('page.fragmentDestinations.datastore-actions', PageSlug::DapterDesignActions->url().'#datastore-actions')
        );
});

test('keeps current task fragments and unrelated guides on their own page', function () {
    expect(PageSlug::DapterRoadmap->page()->fragmentDestinations())->not->toHaveKey('todo-2-1');
    expect(PageSlug::DapterListing->page()->fragmentDestinations())->toBe([]);
});

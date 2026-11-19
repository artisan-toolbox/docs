<?php

use App\Documentation\PageSlug;
use Inertia\Testing\AssertableInertia as Assert;

test('serves a prerequisite ordered DataView journey with real source links and breadcrumbs', function () {
    $root = PageSlug::FrontAwesomeDataView;
    $children = array_values(array_filter(PageSlug::cases(), fn (PageSlug $slug): bool => $slug->parent() === $root));
    expect(array_map(fn (PageSlug $slug): string => basename($slug->value), $children))
        ->toBe(['layouts', 'query-controls', 'ordering', 'selection', 'paging', 'actions', 'adapter-state', 'live-updates', 'reference']);
    foreach ([$root, ...$children] as $slug) {
        $metadata = $slug->page();
        $index = $slug === $root ? 3 : 4;
        expect(is_file(base_path($metadata->sourcePath)))->toBeTrue();
        $this->withoutVite()->get($slug->url(absolute: false))->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component($metadata->component)
            ->where('page.title', $metadata->title)
            ->where('page.slug', $slug->value)
            ->where('page.package.composerName', 'artisan-toolbox/front-awesome')
            ->where('page.sourceUrl', 'https://github.com/artisan-toolbox/docs/blob/1.x/'.$metadata->sourcePath)
            ->where('page.breadcrumbs.3.href', $root->url(false))
            ->where('page.breadcrumbs.'.$index.'.current', true));
    }
});

test('preserves both development URLs and their historical section destinations', function () {
    foreach (['docs', 'packages'] as $prefix) {
        $this->get('/'.$prefix.'/front-awesome/development/data-view')
            ->assertMovedPermanently()->assertRedirect(PageSlug::FrontAwesomeDataView->url(false));
    }
    $fragments = PageSlug::FrontAwesomeDataView->page()->fragmentDestinations();
    expect(array_keys($fragments))->toBe(['one-adapter', 'compare-layouts', 'columns-and-slots', 'server-controls', 'authorized-actions', 'paging-modes', 'dapter-coverage', 'review-next']);
    foreach ($fragments as $fragment => $slug) {
        expect(file_get_contents(base_path($slug->page()->sourcePath)))->toContain('id="'.$fragment.'"');
    }
});

test('selects exact stock marks and returns distinct stationery records through the public adapter', function (mixed $mark, int $id) {
    $uri = route('dapter.data', ['source' => 'FrontAwesome.Notebooks']);
    $this->postJson($uri, ['version' => 2])->assertOk()->assertJsonPath('capabilities.global.filters.mark.values', [null, false, 0, '0', '', ' ']);
    $state = ['version' => 2, 'fields' => new stdClass, 'global' => ['filters' => ['mark' => ['value' => $mark]]], 'searchMatch' => 'all',
        'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'per_page' => 4, 'current' => 1]];
    $result = $this->postJson($uri, ['version' => 2, 'state' => $state])->assertOk();
    expect(array_column($result->json('data'), 'id'))->toBe([$id]);
    $result->assertJsonPath('requested.global.filters.mark.value', $mark);
})->with([[null, 1], [false, 2], [0, 3], ['0', 4], ['', 5], [' ', 6]]);

test('projects public polling keys through authorization and withdraws the rows after revocation', function () {
    $uri = route('dapter.data', ['source' => 'FrontAwesome.PollingNotebooks']);
    $this->postJson(route('demo.dapter.live.start'))->assertOk();
    $this->postJson($uri, ['version' => 2])->assertOk()->assertJsonPath('data.0', ['id' => 1, 'name' => 'Notebook 01']);
    $this->postJson(route('demo.dapter.live.change'), ['source' => 'Dapter.LivePolling', 'operation' => 'mutate'])->assertOk();
    $this->postJson($uri, ['version' => 2])->assertOk()->assertJsonPath('data.0', ['id' => 1, 'name' => 'Changed notebook 2']);
    $this->postJson(route('demo.dapter.live.change'), ['source' => 'Dapter.LivePolling', 'operation' => 'revoke'])->assertOk();
    $this->app['auth']->forgetGuards();
    $this->postJson($uri, ['version' => 2])->assertUnauthorized()->assertJsonMissingPath('data');
});

test('publishes scoped record selectors and reports the fictional count after a failed write', function (int $protocol) {
    $source = 'FrontAwesome.NotebookActions';
    $uri = route('dapter.data', ['source' => $source]);
    $this->postJson(route('demo.dapter.actions.start'))->assertOk();
    $this->postJson($uri, ['version' => $protocol])->assertOk()
        ->assertJsonPath('actions.record.target.input', 'recordId')
        ->assertJsonPath('actions.record.target.values.0.value', 1)
        ->assertJsonPath('actions.interrupted.transports', ['http']);
    $this->withHeaders(['X-Dapter-Transport' => 'http', 'X-Dapter-Action' => '1'])
        ->postJson(route('dapter.action', ['source' => $source, 'action' => 'interrupted']), ['name' => 'Notebook editor'])->assertServiceUnavailable();
    $this->postJson($uri, ['version' => $protocol])->assertOk()->assertJsonPath('data.0.writes', 1);
    $this->postJson(route('demo.dapter.actions.revoke'))->assertOk();
    $this->postJson($uri, ['version' => $protocol])->assertOk()->assertJsonMissingPath('actions.record');
})->with([1, 2]);

test('combines a field match with a global match as the notebook guide describes', function (string $match, array $ids) {
    $state = [
        'version' => 2, 'fields' => ['name' => ['search' => ['value' => 'Notebook 2', 'matchType' => 'equals']]],
        'global' => ['search' => ['value' => 'C']], 'searchMatch' => $match,
        'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'current' => 1, 'per_page' => 6],
    ];
    $result = $this->postJson(route('dapter.data', ['source' => 'FrontAwesome.Notebooks']), ['version' => 2, 'state' => $state])->assertOk();

    expect(array_column($result->json('data'), 'id'))->toBe($ids);
})->with([['all', []], ['any', [2, 5, 6]]]);

test('advertises different empty policies for shelves and allowed marks', function () {
    $uri = route('dapter.data', ['source' => 'FrontAwesome.Notebooks']);
    $this->postJson($uri, ['version' => 2])->assertOk()
        ->assertJsonPath('capabilities.fields.shelf.filters.shelves.empty', 'clear')
        ->assertJsonPath('capabilities.global.filters.marks.empty', 'reject');

    $state = ['version' => 2, 'fields' => ['shelf' => ['filters' => ['shelves' => ['value' => []]]]], 'global' => new stdClass,
        'searchMatch' => 'all', 'order' => ['kind' => 'default'], 'paging' => ['mode' => 'offset', 'current' => 1, 'per_page' => 6]];
    $this->postJson($uri, ['version' => 2, 'state' => $state])->assertOk()->assertJsonCount(6, 'data');
    $state['global'] = ['filters' => ['marks' => ['value' => []]]];
    $this->postJson($uri, ['version' => 2, 'state' => $state])->assertUnprocessable()->assertJsonMissingPath('data');
});

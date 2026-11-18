<?php

use ArtisanToolbox\Dapter\Broadcasting\PublishUpdates;
use ArtisanToolbox\Dapter\Broadcasting\RowUpdated;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;

function startDapterLiveFixture(): void
{
    test()->postJson(route('demo.dapter.live.start'))->assertOk()->assertJsonPath('ready', true);
}
function dapterLiveChange(string $source, string $operation = 'update'): void
{
    test()->postJson(route('demo.dapter.live.change'), ['source' => 'Dapter.'.$source, 'operation' => $operation])->assertOk();
}
test('projects nested Resources through both declarations and read versions', function (string $source, int $version) {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.'.$source]), ['version' => $version])->assertOk();
    expect($response->json('data.0'))->toBe(['name' => 'Notebook 01', 'details' => ['reader' => 'guest', 'selected' => 'guest'], 'related' => [['reader' => 'guest', 'selected' => 'guest']]]);
    expect($response->json('data.0'))->not->toHaveKeys(['id', 'secret']);
    if ($version === 1) {
        expect($response->json())->not->toHaveKey('metadata');
    }
})->with(['ResourceFluent', 'ResourceAttributes'])->with([1, 2]);

test('runs fixed live declarations with raw identity and selected nested reader', function (string $source, string $mode, int|string $id) {
    startDapterLiveFixture();
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.'.$source]), ['version' => 2])->assertOk();
    $response->assertJsonPath('metadata.records.mode', $mode)->assertJsonPath('metadata.records.rows.0.id', $id);
    expect($response->json('metadata.channel'))->toHaveKeys(['type', 'name', 'event']);
    $response->assertJsonPath('data.0.details.selected', 'Fictional reader')->assertJsonPath('data.0.related.0.selected', 'Fictional reader');
    expect($response->json('data.0'))->not->toHaveKeys(['id', 'revision', 'secret', 'tenant']);
})->with([['LivePrivate', 'revisioned', 1], ['LiveAttributes', 'revisioned', 1], ['LiveShorthand', 'identified', 1], ['LiveIdentity', 'revisioned', 'notebook:1'], ['LiveArrival', 'identified', 1], ['LiveNative', 'revisioned', 'notebook:1']]);

test('keeps public projection plain and requires the synthetic producer separately', function () {
    $response = $this->postJson(route('dapter.data', ['source' => 'Dapter.LivePublic']), ['version' => 2])->assertOk();
    $response->assertJsonPath('metadata.channel.type', 'public');
    expect($response->json('data.0'))->toBe(['name' => 'Public notebook']);
    $this->postJson(route('demo.dapter.live.change'), ['source' => 'Dapter.LivePublic', 'operation' => 'update'])->assertForbidden();
});

test('queues committed updates on demos and reuses the actual HTTP projection', function () {
    Queue::fake();
    Event::fake([RowUpdated::class]);
    startDapterLiveFixture();
    $before = [config('dapter.broadcasting.queue_connection'), config('dapter.broadcasting.queue')];
    dapterLiveChange('LivePrivate');
    Queue::assertPushedOn('demos', PublishUpdates::class);
    $job = Queue::pushed(PublishUpdates::class)->first();
    expect($job->connection)->toBe('redis')->and([config('dapter.broadcasting.queue_connection'), config('dapter.broadcasting.queue')])->toBe($before);
    app()->call([$job, 'handle']);
    Event::assertDispatched(function (RowUpdated $event): bool {
        $payload = json_decode(json_encode($event, JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);

        return $payload['data'][0]['name'] === 'Changed notebook 2' && $payload['data'][0]['details']['selected'] === 'Fictional reader' && $payload['records']['rows'][0] === ['id' => 1, 'revision' => '2'];
    });
});

test('does not queue rollback and unknown IDs emit nothing', function () {
    Queue::fake();
    Event::fake([RowUpdated::class]);
    startDapterLiveFixture();
    dapterLiveChange('LivePrivate', 'rollback');
    Queue::assertNothingPushed();
    dapterLiveChange('LivePrivate', 'unknown');
    app()->call([Queue::pushed(PublishUpdates::class)->first(), 'handle']);
    Event::assertNotDispatched(RowUpdated::class);
});

test('reauthorizes queued work and preserves the real account', function () {
    Queue::fake();
    Event::fake([RowUpdated::class]);
    startDapterLiveFixture();
    $web = auth('web')->user();
    dapterLiveChange('LivePrivate');
    $job = Queue::pushed(PublishUpdates::class)->first();
    dapterLiveChange('LivePrivate', 'revoke');
    app()->call([$job, 'handle']);
    Event::assertNotDispatched(RowUpdated::class);
    expect(auth('web')->user())->toBe($web);
    $this->postJson(route('dapter.data', ['source' => 'Dapter.LivePrivate']), ['version' => 2])->assertUnauthorized();
});

test('provides HTTP-only polling without a channel or job', function () {
    Queue::fake();
    startDapterLiveFixture();
    $route = route('dapter.data', ['source' => 'Dapter.LivePolling']);
    $this->postJson($route, ['version' => 2])->assertOk()->assertJsonPath('metadata.channel', null)->assertJsonPath('data.0.name', 'Notebook 01');
    dapterLiveChange('LivePolling', 'mutate');
    $this->postJson($route, ['version' => 2])->assertOk()->assertJsonPath('data.0.name', 'Changed notebook 2');
    Queue::assertNothingPushed();
});

test('captures actual installed route envelopes and their matching queued event for component consumers', function () {
    Queue::fake();
    Event::fake([RowUpdated::class]);
    $wire = [];
    foreach (['ResourceFluent', 'ResourceAttributes'] as $source) {
        $wire[$source] = json_decode($this->postJson(route('dapter.data', ['source' => 'Dapter.'.$source]), ['version' => 1])->assertOk()->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    startDapterLiveFixture();
    foreach (['LivePrivate', 'LiveAttributes', 'LiveShorthand', 'LiveIdentity', 'LiveArrival', 'LiveNative', 'LivePublic', 'LivePolling', 'LivePollingProps'] as $source) {
        $wire[$source] = json_decode($this->postJson(route('dapter.data', ['source' => 'Dapter.'.$source]), ['version' => 2])->assertOk()->getContent(), flags: JSON_THROW_ON_ERROR);
    }
    dapterLiveChange('LivePrivate');
    app()->call([Queue::pushed(PublishUpdates::class)->first(), 'handle']);
    $wire['LivePrivateUpdate'] = json_decode(json_encode(Event::dispatched(RowUpdated::class)->first()[0], JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);
    $file = base_path('resources/js/components/demo/dapter/live/wire.json');
    if (getenv('UPDATE_DAPTER_LIVE_FIXTURES') === '1') {
        file_put_contents($file, json_encode($wire, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n");
    }
    $captured = json_decode(file_get_contents($file), true, flags: JSON_THROW_ON_ERROR);
    foreach ($wire as $source => $envelope) {
        $envelope = json_decode(json_encode($envelope, JSON_THROW_ON_ERROR), true, flags: JSON_THROW_ON_ERROR);
        expect(array_keys($captured[$source]))->toBe(array_keys($envelope));
        expect($captured[$source]['data'])->toBe($envelope['data']);
    }
});

test('executes committed updates for each declared projection and identity mode', function (string $source, int|string $id) {
    Queue::fake();
    Event::fake([RowUpdated::class]);
    startDapterLiveFixture();
    dapterLiveChange($source);
    app()->call([Queue::pushed(PublishUpdates::class)->first(), 'handle']);
    Event::assertDispatched(fn (RowUpdated $event): bool => $event->source === 'Dapter.'.$source && $event->records['rows'][0]['id'] === $id);
})->with([['LiveAttributes', 1], ['LiveIdentity', 'notebook:1'], ['LiveNative', 'notebook:1'], ['LiveShorthand', 1], ['LiveArrival', 1], ['LivePublic', 1]]);

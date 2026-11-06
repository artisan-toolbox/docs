<?php

use App\Demo\Mosaicast\InertiaDelivery\CompleteDemo;
use App\Demo\Mosaicast\InertiaDelivery\OrderUpdated;
use App\Models\User;
use ArtisanToolbox\Mosaicast\Events\BroadcastMosaicastEvent;
use Illuminate\Queue\SyncQueue;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;

function deliveryDemoInput(string $scenario = 'string'): array
{
    return ['scenario' => $scenario, 'message' => 'Order 42 is ready.', 'runId' => '19f3f57b-f93c-40f4-a0ad-15a3fa20a3bb'];
}

function configureQueuedDeliveryDemo(): void
{
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.app_id' => 'private-demo-app-id',
        'broadcasting.connections.reverb.key' => 'public-demo-key',
        'broadcasting.connections.reverb.secret' => 'private-demo-secret',
        'broadcasting.connections.reverb.options.host' => 'localhost',
        'queue.connections.redis.driver' => 'redis',
    ]);
}

test('delivers the same named event through manual Inertia props and Mosaicast without broadcasting', function () {
    Event::fake(['demo.orders.updated', BroadcastMosaicastEvent::class]);

    $this->withHeaders(['X-Inertia' => 'true'])->post(route('demo.mosaicast.delivery'), deliveryDemoInput())
        ->assertOk()
        ->assertJsonPath('component', 'docs/mosaicast/InertiaDelivery')
        ->assertJsonPath('props.demoResult.nativeDispatched', 1)
        ->assertJsonPath('props.demoResult.manualEvents.0.name', 'demo.orders.updated')
        ->assertJsonPath('props.demoResult.manualEvents.0.payload.orderId', 42)
        ->assertJsonPath('props.mosaicast.events.0.name', 'demo.orders.updated')
        ->assertJsonPath('props.mosaicast.events.0.payload', [
            'runId' => '19f3f57b-f93c-40f4-a0ad-15a3fa20a3bb',
            'orderId' => 42,
            'message' => 'Order 42 is ready.',
            'sequence' => 1,
        ]);

    Event::assertDispatchedTimes('demo.orders.updated', 1);
    Event::assertNotDispatched(BroadcastMosaicastEvent::class);
});

test('delivers an ordinary Laravel event object using its public broadcast contract', function () {
    Event::fake([OrderUpdated::class]);

    $this->withHeaders(['X-Inertia' => 'true'])->post(route('demo.mosaicast.delivery'), deliveryDemoInput('object'))
        ->assertOk()
        ->assertJsonPath('props.mosaicast.events.0.name', 'demo.orders.object-updated')
        ->assertJsonPath('props.mosaicast.events.0.payload.message', 'Order 42 is ready.')
        ->assertJsonPath('props.demoResult.manualEvents.0.payload.sequence', 1);

    Event::assertDispatched(fn (OrderUpdated $event): bool => $event->broadcastAs() === 'demo.orders.object-updated'
        && $event->broadcastWith()['message'] === 'Order 42 is ready.');
});

test('keeps three distinct events ordered and identical in both partial response paths', function () {
    Event::fake(['demo.orders.accepted', 'demo.reports.prepared', 'demo.notifications.created']);

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'X-Inertia-Partial-Component' => 'docs/mosaicast/InertiaDelivery',
        'X-Inertia-Partial-Data' => 'mosaicast,demoResult',
    ])->post(route('demo.mosaicast.delivery'), deliveryDemoInput('multiple'))->assertOk();

    $response->assertJsonCount(3, 'props.mosaicast.events')
        ->assertJsonPath('props.mosaicast.events.0.name', 'demo.orders.accepted')
        ->assertJsonPath('props.mosaicast.events.1.name', 'demo.reports.prepared')
        ->assertJsonPath('props.mosaicast.events.2.name', 'demo.notifications.created')
        ->assertJsonPath('props.mosaicast.events.2.payload.sequence', 3)
        ->assertJsonPath('props.demoResult.nativeDispatched', 3);

    expect($response->json('props.demoResult.manualEvents'))->toBe($response->json('props.mosaicast.events'));
    Event::assertDispatchedTimes('demo.orders.accepted', 1);
    Event::assertDispatchedTimes('demo.reports.prepared', 1);
    Event::assertDispatchedTimes('demo.notifications.created', 1);
});

test('rejects invalid demo input before dispatching any event', function (array $changes, string $field) {
    Event::fake(['demo.orders.updated', OrderUpdated::class, BroadcastMosaicastEvent::class]);

    $this->postJson(route('demo.mosaicast.delivery'), array_replace(deliveryDemoInput(), $changes))
        ->assertUnprocessable()->assertJsonValidationErrors($field);

    Event::assertNothingDispatched();
})->with([
    'unknown scenario' => [['scenario' => 'arbitrary.event'], 'scenario'],
    'empty message' => [['message' => ''], 'message'],
    'oversized message' => [['message' => str_repeat('x', 121)], 'message'],
    'invalid run identifier' => [['runId' => '../another-session'], 'runId'],
    'client session override' => [['sessionIdentifier' => str_repeat('a', 64)], 'sessionIdentifier'],
    'client channel override' => [['channel' => 'private-another-session'], 'channel'],
]);

test('requires authentication before accepting queued work', function () {
    Queue::fake([CompleteDemo::class]);
    $this->post(route('demo.mosaicast.queue'), deliveryDemoInput())->assertRedirect(route('login'));
    Queue::assertNothingPushed();
});

test('shares the configured session channel prefix with the bootstrap and queue demo', function () {
    config(['mosaicast.broadcasting.session_channel_prefix' => 'docs.session-events']);
    $this->withoutVite();

    $this->get('/docs/mosaicast/inertia-delivery')->assertOk()->assertInertia(fn ($page) => $page
        ->where('mosaicastChannelPrefix', 'docs.session-events')
        ->where('mosaicastDemo.channelPrefix', 'docs.session-events')
    );
});

test('refuses queued work from accounts without verified staff access', function (string $email, bool $verified) {
    Queue::fake([CompleteDemo::class]);
    $user = User::factory()->create(['email' => $email, 'email_verified_at' => $verified ? now() : null]);
    $this->actingAs($user)->post(route('demo.mosaicast.queue'), deliveryDemoInput())->assertForbidden();
    Queue::assertNothingPushed();
})->with([
    'outsider' => ['reader@example.test', true],
    'unverified staff' => ['staff@atb.dev.br', false],
]);

test('refuses queued work when the broadcaster is not configured', function () {
    Queue::fake([CompleteDemo::class]);
    $this->actingAs(User::factory()->create(['email' => 'staff@atb.dev.br']))
        ->post(route('demo.mosaicast.queue'), deliveryDemoInput())->assertStatus(503);
    Queue::assertNothingPushed();
});

test('refuses queued work with HTTP 503 when a required server setting is missing', function (string $setting) {
    configureQueuedDeliveryDemo();
    config([$setting => null]);
    Queue::fake([CompleteDemo::class]);

    $this->actingAs(User::factory()->create(['email' => 'staff@atb.dev.br']))
        ->post(route('demo.mosaicast.queue'), deliveryDemoInput())->assertStatus(503);

    Queue::assertNothingPushed();
})->with([
    'application identifier' => 'broadcasting.connections.reverb.app_id',
    'application key' => 'broadcasting.connections.reverb.key',
    'signing secret' => 'broadcasting.connections.reverb.secret',
    'server host' => 'broadcasting.connections.reverb.options.host',
    'Redis driver' => 'queue.connections.redis.driver',
    'Reverb broadcaster' => 'broadcasting.default',
]);

test('shares queue readiness without exposing private Reverb configuration', function () {
    configureQueuedDeliveryDemo();
    $this->withoutVite();

    $this->get('/docs/mosaicast/inertia-delivery')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('mosaicastDemo.queueConfigured', true))
        ->assertDontSee('private-demo-app-id')
        ->assertDontSee('private-demo-secret');
});

test('captures the current opaque session target and queues one bounded job for Horizon', function () {
    configureQueuedDeliveryDemo();
    Queue::fake([CompleteDemo::class]);

    $response = $this->actingAs(User::factory()->create(['email' => 'staff@atb.dev.br']))
        ->withHeaders(['X-Inertia' => 'true'])
        ->post(route('demo.mosaicast.queue'), deliveryDemoInput())
        ->assertOk()
        ->assertJsonPath('props.demoResult.status', 'queued')
        ->assertJsonPath('props.demoResult.queue', 'demos')
        ->assertJsonCount(0, 'props.mosaicast.events');

    Queue::assertPushedOn('demos', CompleteDemo::class, fn (CompleteDemo $job): bool => $job->connection === 'redis'
        && $job->sessionIdentifier === $response->json('props.mosaicastSessionIdentifier')
        && $job->runId === '19f3f57b-f93c-40f4-a0ad-15a3fa20a3bb'
        && $job->message === 'Order 42 is ready.'
        && (new SyncQueue)->getJobTries($job) === 1);
    Queue::assertPushed(CompleteDemo::class, 1);
});

test('the job broadcasts its actual payload only to the captured session', function () {
    Event::fake([BroadcastMosaicastEvent::class]);
    $target = str_repeat('a', 64);

    (new CompleteDemo($target, '19f3f57b-f93c-40f4-a0ad-15a3fa20a3bb', 'Order 42 is ready.'))->handle();

    Event::assertDispatched(fn (BroadcastMosaicastEvent $event): bool => $event->broadcastOn()->name === 'private-mosaicast.sessions.'.$target
        && $event->broadcastAs() === 'demo.jobs.completed'
        && $event->broadcastWith() === [
            'runId' => '19f3f57b-f93c-40f4-a0ad-15a3fa20a3bb',
            'orderId' => 42,
            'message' => 'Order 42 is ready.',
            'sequence' => 1,
        ]);
});

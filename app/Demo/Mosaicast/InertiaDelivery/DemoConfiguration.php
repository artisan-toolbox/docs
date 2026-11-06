<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

use Illuminate\Http\Request;

final class DemoConfiguration
{
    /** @return array{deliveryUrl: string, queueUrl: string, queueAllowed: bool, queueConfigured: bool, broadcaster: string, channelPrefix: string} */
    public function props(Request $request): array
    {
        $broadcaster = config('broadcasting.default');

        return [
            'deliveryUrl' => route('demo.mosaicast.delivery', absolute: false),
            'queueUrl' => route('demo.mosaicast.queue', absolute: false),
            'queueAllowed' => $request->user()?->can('runDemos') ?? false,
            'queueConfigured' => $this->queueConfigured(),
            'broadcaster' => is_string($broadcaster) ? $broadcaster : 'null',
            'channelPrefix' => config()->string('mosaicast.broadcasting.session_channel_prefix'),
        ];
    }

    public function queueConfigured(): bool
    {
        return config('broadcasting.default') === 'reverb'
            && config('queue.connections.redis.driver') === 'redis'
            && filled(config('broadcasting.connections.reverb.app_id'))
            && filled(config('broadcasting.connections.reverb.key'))
            && filled(config('broadcasting.connections.reverb.secret'))
            && filled(config('broadcasting.connections.reverb.options.host'));
    }
}

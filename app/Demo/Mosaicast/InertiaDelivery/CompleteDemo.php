<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

use ArtisanToolbox\Mosaicast\Facades\Mosaicast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\Timeout;
use Illuminate\Queue\Attributes\Tries;

#[Timeout(15)]
#[Tries(1)]
final class CompleteDemo implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $sessionIdentifier,
        public readonly string $runId,
        public readonly string $message,
    ) {}

    public function handle(): void
    {
        Mosaicast::toSession($this->sessionIdentifier)->dispatch('demo.jobs.completed', [
            'runId' => $this->runId,
            'orderId' => 42,
            'message' => $this->message,
            'sequence' => 1,
        ]);
    }
}

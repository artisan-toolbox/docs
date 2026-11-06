<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

final readonly class OrderUpdated
{
    public function __construct(
        private string $eventName,
        public string $runId,
        public string $message,
        public int $sequence = 1,
    ) {}

    public function broadcastAs(): string
    {
        return $this->eventName;
    }

    /** @return array{runId: string, orderId: int, message: string, sequence: int} */
    public function broadcastWith(): array
    {
        return [
            'runId' => $this->runId,
            'orderId' => 42,
            'message' => $this->message,
            'sequence' => $this->sequence,
        ];
    }
}

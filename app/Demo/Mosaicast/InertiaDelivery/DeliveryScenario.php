<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

enum DeliveryScenario: string
{
    case StringEvent = 'string';
    case EventObject = 'object';
    case MultipleEvents = 'multiple';

    /** @return list<OrderUpdated> */
    public function events(string $message, string $runId): array
    {
        $names = match ($this) {
            self::StringEvent => ['demo.orders.updated'],
            self::EventObject => ['demo.orders.object-updated'],
            self::MultipleEvents => ['demo.orders.accepted', 'demo.reports.prepared', 'demo.notifications.created'],
        };

        return array_map(
            fn (string $name, int $index): OrderUpdated => new OrderUpdated($name, $runId, $message, $index + 1),
            $names,
            array_keys($names),
        );
    }
}

<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use App\Http\Controllers\DocumentationController;
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;
use Illuminate\Contracts\Events\Dispatcher;
use Inertia\Response;

final class DeliveryController
{
    public function __invoke(DeliveryRequest $request, Dispatcher $events, DocumentationController $pages, Documentation $documentation): Response
    {
        $scenario = DeliveryScenario::from($request->string('scenario')->toString());
        $manualEvents = [];

        foreach ($scenario->events($request->string('message')->toString(), $request->string('runId')->toString()) as $event) {
            if ($scenario === DeliveryScenario::EventObject) {
                $events->dispatch($event);
                Mosaicast::dispatch($event);
            } else {
                $events->dispatch($event->broadcastAs(), [$event->broadcastWith()]);
                Mosaicast::dispatch($event->broadcastAs(), $event->broadcastWith());
            }

            $manualEvents[] = ['name' => $event->broadcastAs(), 'payload' => $event->broadcastWith()];
        }

        return $pages->show($request, $documentation, PageSlug::MosaicastInertiaDelivery)->with('demoResult', [
            'runId' => $request->string('runId')->toString(),
            'scenario' => $scenario->value,
            'nativeDispatched' => count($manualEvents),
            'manualEvents' => $manualEvents,
        ]);
    }
}

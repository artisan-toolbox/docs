<?php

namespace App\Demo\Mosaicast\InertiaDelivery;

use App\Documentation\Documentation;
use App\Documentation\PageSlug;
use App\Http\Controllers\DocumentationController;
use ArtisanToolbox\Mosaicast\Facades\Mosaicast;
use Inertia\Response;

final class QueueController
{
    public function __invoke(DeliveryRequest $request, DemoConfiguration $configuration, DocumentationController $pages, Documentation $documentation): Response
    {
        abort_unless($configuration->queueConfigured(), 503, 'The queued demo requires Redis, Reverb, and its public browser connection settings.');

        dispatch(new CompleteDemo(Mosaicast::currentSessionIdentifier(), $request->string('runId')->toString(), $request->string('message')->toString()))->onConnection('redis')->onQueue('demos');

        return $pages->show($request, $documentation, PageSlug::MosaicastInertiaDelivery)->with('demoResult', [
            'runId' => $request->string('runId')->toString(),
            'scenario' => 'queued',
            'status' => 'queued',
            'queue' => 'demos',
        ]);
    }
}

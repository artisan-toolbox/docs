<?php

use App\Demo\Core\ConditionalArrays\ConditionalArraysController;
use App\Demo\FrontAwesome\Printing\DocumentsController;
use App\Demo\Mosaicast\InertiaDelivery\DeliveryController;
use App\Demo\Mosaicast\InertiaDelivery\QueueController;
use Illuminate\Support\Facades\Route;

Route::post('demo/front-awesome/printing/documents', DocumentsController::class)
    ->middleware('throttle:20,1')
    ->name('demo.front-awesome.printing.documents');

Route::post('demo/core/conditional-arrays', ConditionalArraysController::class)
    ->middleware('throttle:20,1')
    ->name('demo.core.conditional-arrays');

Route::prefix('demo/mosaicast')->name('demo.mosaicast.')->group(function (): void {
    Route::post('delivery', DeliveryController::class)
        ->middleware('throttle:20,1')
        ->name('delivery');

    Route::post('queue', QueueController::class)
        ->middleware(['auth', 'can:runDemos', 'throttle:6,1'])
        ->name('queue');
});

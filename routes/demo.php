<?php

use App\Demo\Core\ConditionalArrays\ConditionalArraysController;
use App\Demo\Dapter\Actions\State;
use App\Demo\FrontAwesome\PermissionEditor\AssignmentsController;
use App\Demo\FrontAwesome\Printing\DocumentsController;
use App\Demo\Mosaicast\InertiaDelivery\DeliveryController;
use App\Demo\Mosaicast\InertiaDelivery\QueueController;
use Illuminate\Support\Facades\Route;

Route::post('demo/front-awesome/printing/documents', DocumentsController::class)
    ->middleware('throttle:20,1')
    ->name('demo.front-awesome.printing.documents');

Route::prefix('demo/front-awesome/permission-editor')->name('demo.front-awesome.permission-editor.')
    ->middleware('throttle:60,1')->group(function (): void {
        Route::get('/', [AssignmentsController::class, 'show'])->block()->name('show');
        Route::put('/', [AssignmentsController::class, 'update'])->block()->name('update');
        Route::get('/export', [AssignmentsController::class, 'export'])->block()->name('export');
    });

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

Route::post('demo/dapter/actions/start', [State::class, 'start'])->name('demo.dapter.actions.start');
Route::post('demo/dapter/actions/revoke', [State::class, 'revoke'])->name('demo.dapter.actions.revoke');

Route::post('demo/dapter/paging/reset', [App\Demo\Dapter\Paging\State::class, 'reset'])->name('demo.dapter.paging.reset');
Route::post('demo/dapter/paging/scope', [App\Demo\Dapter\Paging\State::class, 'scope'])->name('demo.dapter.paging.scope');
Route::post('demo/dapter/paging/expire', [App\Demo\Dapter\Paging\State::class, 'expire'])->name('demo.dapter.paging.expire');

Route::prefix('demo/dapter/live')->name('demo.dapter.live.')->group(function (): void {
    Route::post('start', [App\Demo\Dapter\Live\State::class, 'start'])->name('start');
    Route::post('reset', [App\Demo\Dapter\Live\State::class, 'reset'])->name('reset');
    Route::post('change', [App\Demo\Dapter\Live\State::class, 'change'])->middleware('throttle:30,1')->name('change');
});

Route::post('demo/dapter/infinite/fail', [App\Demo\Dapter\Infinite\State::class, 'fail'])->name('demo.dapter.infinite.fail');
Route::post('demo/dapter/infinite/reset', [App\Demo\Dapter\Infinite\State::class, 'reset'])->name('demo.dapter.infinite.reset');

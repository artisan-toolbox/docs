<?php

use App\Http\Controllers\DocumentationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::get('/docs', [DocumentationController::class, 'show'])->name('docs.index');
Route::get('/docs/{slug}', [DocumentationController::class, 'show'])
    ->where('slug', '[a-z0-9-]+(?:/[a-z0-9-]+)*')
    ->name('docs.show');
Route::permanentRedirect('/packages/maintainer', '/docs/maintainer');
Route::permanentRedirect('/favicon.ico', '/favicons/favicon.ico');
Route::permanentRedirect('/apple-touch-icon.png', '/favicons/apple-touch-icon.png');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

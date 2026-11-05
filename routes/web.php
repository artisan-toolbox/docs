<?php

use App\Http\Controllers\Auth\EmailLoginController;
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

Route::middleware('guest')->group(function () {
    Route::get('/login', [EmailLoginController::class, 'create'])->name('login');
    Route::post('/login/email', [EmailLoginController::class, 'send'])
        ->middleware('throttle:login.email')
        ->name('login.email');
    Route::post('/login', [EmailLoginController::class, 'store'])
        ->middleware('throttle:login.code')
        ->name('login.store');
});

Route::post('/logout', [EmailLoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

<?php

use App\Documentation\PageSlug;
use App\Http\Controllers\Auth\EmailLoginController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\DocumentationSearchController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use App\Http\Middleware\DocumentationSearchHeaders;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');

require __DIR__.'/demo.php';

Route::get('/docs', [DocumentationController::class, 'show'])->name('docs.index');
Route::get('/docs/search', DocumentationSearchController::class)
    ->middleware([DocumentationSearchHeaders::class, 'throttle:60,1'])
    ->name('docs.search');
Route::get('/docs/{slug}', [DocumentationController::class, 'show'])
    ->where('slug', '[a-z0-9-]+(?:/[a-z0-9-]+)*')
    ->name('docs.show');
Route::get('/packages', fn (): RedirectResponse => redirect(PageSlug::Index->url(absolute: false), 301));
Route::get('/packages/maintainer/project-integration', fn (): RedirectResponse => redirect(PageSlug::MaintainerVersioningProjectIntegration->url(absolute: false), 301));
Route::get('/packages/qztray/v1-readiness', fn (): RedirectResponse => redirect(PageSlug::QzTrayCompatibility->url(absolute: false), 301));
Route::get('/getting-started', fn (): RedirectResponse => redirect(PageSlug::GettingStarted->url(absolute: false), 301));
Route::get('/getting-started/choose-a-package', fn (): RedirectResponse => redirect(PageSlug::ChoosePackage->url(absolute: false), 301));
Route::get('/project', fn (): RedirectResponse => redirect(PageSlug::Project->url(absolute: false), 301));
Route::get('/project/documentation-policy', fn (): RedirectResponse => redirect(PageSlug::ProjectDocumentationPolicy->url(absolute: false), 301));
Route::get('/project/versioning', fn (): RedirectResponse => redirect(PageSlug::ProjectVersioning->url(absolute: false), 301));
Route::get('/packages/{slug}', fn (PageSlug $slug): RedirectResponse => redirect($slug->url(absolute: false), 301))
    ->where('slug', '[a-z0-9-]+(?:/[a-z0-9-]+)*');
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

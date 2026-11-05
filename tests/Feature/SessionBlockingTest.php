<?php

use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Exceptions;

test('public pages cannot read a session while its sign-in challenge is being changed', function (string $path) {
    config([
        'session.driver' => 'database',
        'session.block_store' => 'database',
        'session.block_wait_seconds' => 0,
    ]);
    resolve('session')->forgetDrivers();
    app()->forgetInstance('session.store');
    Exceptions::fake();

    $session = resolve('session')->driver();
    $session->start();
    $session->put('auth.login_challenge', [
        'email' => 'staff@atb.dev.br',
        'hash' => 'stored-code-hash',
        'expires_at' => now()->addMinutes(10)->timestamp,
        'attempts' => 4,
    ]);
    $session->save();

    $lock = Cache::store('database')->lock('session:'.$session->getId(), 10);
    expect($lock->get())->toBeTrue();

    try {
        $this->withCookie(config('session.cookie'), $session->getId())
            ->get($path)
            ->assertServerError();

        Exceptions::assertReported(LockTimeoutException::class);
        $session->forget('auth.login_challenge');
        $session->save();
    } finally {
        $lock->release();
    }

    $this->get($path)
        ->assertOk()
        ->assertSessionMissing('auth.login_challenge');
})->with(['/', '/docs', '/login']);

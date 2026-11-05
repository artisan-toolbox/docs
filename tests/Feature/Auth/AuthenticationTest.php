<?php

use App\Models\User;
use App\Notifications\LoginCode;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Notification::fake();
    config(['mail.default' => 'smtp']);
});

test('rejects pending codes issued for the previously specified domain', function () {
    $this->withSession(['auth.login_challenge' => [
        'email' => 'person@atp.dev.br',
        'hash' => Hash::make('123456'),
        'expires_at' => now()->addMinutes(10)->timestamp,
        'attempts' => 0,
    ]])->post('/login', ['code' => '123456'])
        ->assertSessionHasErrors('code')
        ->assertSessionMissing('auth.login_challenge');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('the private login screen starts without a pending email', function () {
    $this->get('/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/Login')
            ->where('pendingEmail', null));
});

test('authenticated users are redirected from login to the documentation', function () {
    $this->actingAs(User::factory()->create(['email' => 'person@atb.dev.br']))
        ->get('/login')->assertRedirect('/docs');
});

test('an allowed email receives a six digit code before an account is created', function () {
    $this->post('/login/email', ['email' => '  Person@ATB.DEV.BR  '])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/login');

    Notification::assertSentOnDemand(LoginCode::class, function (LoginCode $notification, array $channels, AnonymousNotifiable $notifiable): bool {
        return $channels === ['mail']
            && $notifiable->routes['mail'] === 'person@atb.dev.br'
            && preg_match('/^\d{6}$/', $notification->code) === 1;
    });

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
    $this->get('/login')->assertInertia(fn (Assert $page) => $page
        ->where('pendingEmail', 'person@atb.dev.br'));
});

test('email challenges reject addresses outside the exact allowed domain', function (mixed $email) {
    $this->post('/login/email', ['email' => $email])->assertSessionHasErrors('email');

    Notification::assertNothingSent();
    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
})->with([
    'outside domain' => 'person@example.com',
    'subdomain' => 'person@team.atb.dev.br',
    'previous domain' => 'person@atp.dev.br',
    'suffix lookalike' => 'person@atb.dev.br.example.com',
    'prefix lookalike' => 'person@notatb.dev.br',
    'missing local part' => '@atb.dev.br',
    'malformed address' => 'person at atb.dev.br',
    'empty address' => '',
    'missing address' => null,
    'array input' => [['person@atb.dev.br']],
]);

test('the challenge stores a hash instead of the emailed code', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $challenge = session('auth.login_challenge');

    expect($challenge['hash'])->not->toBe($code)
        ->and(Hash::check($code, $challenge['hash']))->toBeTrue();
    expect(json_encode($challenge))->not->toContain(json_encode($code));
});

test('a valid code creates a verified user and regenerates the authenticated session', function () {
    $this->withSession(['retained' => 'value'])->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $sessionId = session()->getId();

    $this->post('/login', ['code' => $code])
        ->assertSessionHasNoErrors()
        ->assertSessionMissing('auth.login_challenge')
        ->assertRedirect('/docs');

    $user = User::query()->sole();
    $this->assertAuthenticatedAs($user);
    expect($user->email)->toBe('person@atb.dev.br')
        ->and($user->hasVerifiedEmail())->toBeTrue()
        ->and(session()->getId())->not->toBe($sessionId);
});

test('a valid code signs in an existing user without duplicating the account', function () {
    $user = User::factory()->unverified()->create(['email' => 'person@atb.dev.br']);
    $this->post('/login/email', ['email' => $user->email]);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;

    $this->post('/login', ['code' => $code])->assertRedirect('/docs');

    $this->assertAuthenticatedAs($user);
    $this->assertDatabaseCount('users', 1);
    expect($user->refresh()->hasVerifiedEmail())->toBeTrue();
});

test('a database session persists only the code hash and removes old session credentials', function () {
    config([
        'session.driver' => 'database',
        'session.connection' => 'sqlite',
        'session.encrypt' => false,
        'session.lottery' => [0, 100],
    ]);
    resolve('session')->forgetDrivers();
    app()->forgetInstance('session.store');

    $this->post('/login/email', ['email' => 'person@atb.dev.br'])->assertRedirect('/login');
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $challengeId = session()->getId();
    $challengeRow = DB::table('sessions')->find($challengeId);
    $challengePayload = json_decode(base64_decode($challengeRow->payload), true, flags: JSON_THROW_ON_ERROR);

    expect(Hash::check($code, data_get($challengePayload, 'auth.login_challenge.hash')))->toBeTrue()
        ->and($challengeRow->user_id)->toBeNull()
        ->and(base64_decode($challengeRow->payload))->not->toContain(json_encode($code));

    resolve('session')->forgetDrivers();
    app()->forgetInstance('session.store');
    Auth::forgetGuards();
    app()->forgetInstance('auth.driver');
    $this->withCookie(config('session.cookie'), $challengeId)
        ->post('/login', ['code' => $code])->assertRedirect('/docs');

    $authenticatedId = session()->getId();
    $authenticatedRow = DB::table('sessions')->find($authenticatedId);
    $authenticatedPayload = json_decode(base64_decode($authenticatedRow->payload), true, flags: JSON_THROW_ON_ERROR);
    $authKey = Auth::guard()->getName();

    $this->assertDatabaseMissing('sessions', ['id' => $challengeId]);
    expect($authenticatedId)->not->toBe($challengeId)
        ->and($authenticatedRow->user_id)->toBe(User::query()->sole()->id)
        ->and(data_get($authenticatedPayload, 'auth.login_challenge'))->toBeNull()
        ->and($authenticatedPayload[$authKey])->toBe(User::query()->sole()->id);

    resolve('session')->forgetDrivers();
    app()->forgetInstance('session.store');
    Auth::forgetGuards();
    app()->forgetInstance('auth.driver');
    $this->withCookie(config('session.cookie'), $authenticatedId)
        ->post('/logout')->assertRedirect('/');

    $logoutRow = DB::table('sessions')->find(session()->getId());
    $logoutPayload = json_decode(base64_decode($logoutRow->payload), true, flags: JSON_THROW_ON_ERROR);

    $this->assertDatabaseMissing('sessions', ['id' => $authenticatedId]);
    expect($logoutRow->user_id)->toBeNull()
        ->and(data_get($logoutPayload, 'auth.login_challenge'))->toBeNull()
        ->and(array_key_exists($authKey, $logoutPayload))->toBeFalse();
    $this->assertGuest();
});

test('a wrong code does not authenticate or create an account', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $wrongCode = $code === '000000' ? '111111' : '000000';

    $this->post('/login', ['code' => $wrongCode])->assertSessionHasErrors('code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
    $this->post('/login', ['code' => $code])->assertRedirect('/docs');
    $this->assertAuthenticated();
});

test('a code expires after ten minutes', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $this->travel(10)->minutes();

    $this->post('/login', ['code' => $code])->assertSessionHasErrors('code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('a code remains valid immediately before its ten minute expiry', function () {
    $this->freezeTime();
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $this->travel(599)->seconds();

    $this->post('/login', ['code' => $code])->assertRedirect('/docs');

    $this->assertAuthenticated();
});

test('malformed codes are rejected without flashing them into the session', function (mixed $code) {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);

    $this->post('/login', ['code' => $code])
        ->assertSessionHasErrors('code')
        ->assertSessionMissing('_old_input.code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
})->with(['12345', '1234567', 'abcdef', '１２３４５６', [['123456']], null]);

test('five incorrect attempts invalidate the challenge', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $wrongCode = $code === '000000' ? '111111' : '000000';

    foreach (range(1, 5) as $attempt) {
        $this->post('/login', ['code' => $wrongCode])->assertSessionHasErrors('code');
    }

    $this->post('/login', ['code' => $code])->assertSessionHasErrors('code');
    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
    $this->get('/login')->assertInertia(fn (Assert $page) => $page->where('pendingEmail', null));
});

test('resending a code invalidates the previous code', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $originalCode = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $replacementCode = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;

    Notification::assertSentOnDemandTimes(LoginCode::class, 2);
    expect($replacementCode)->not->toBe($originalCode);
    $this->post('/login', ['code' => $originalCode])->assertSessionHasErrors('code');
    $this->assertGuest();
    $this->post('/login', ['code' => $replacementCode])->assertRedirect('/docs');
    $this->assertAuthenticated();
});

test('a code cannot be used from a browser without its challenge', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $this->flushSession();

    $this->post('/login', ['email' => 'person@atb.dev.br', 'code' => $code])
        ->assertSessionHasErrors('code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('a consumed code cannot be replayed after logout', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $code = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    $this->post('/login', ['code' => $code])->assertRedirect('/docs');
    $this->post('/logout')->assertRedirect('/');

    $this->post('/login', ['code' => $code])->assertSessionHasErrors('code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 1);
});

test('password credentials cannot be used as a fallback', function () {
    $user = User::factory()->create(['email' => 'person@atb.dev.br']);

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors('code');

    $this->assertGuest();
    Notification::assertNothingSent();
});

test('codes cannot be sent through mailers that expose or discard their contents', function (string $mailer) {
    config(['mail.default' => $mailer]);

    $this->post('/login/email', ['email' => 'person@atb.dev.br'])
        ->assertSessionHasErrors('email')
        ->assertSessionMissing('auth.login_challenge');

    Notification::assertNothingSent();
    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
})->with(['log', 'array', 'failover']);

test('a delivery failure invalidates the previous challenge without creating an account', function () {
    $this->post('/login/email', ['email' => 'person@atb.dev.br']);
    $originalCode = Notification::sent(new AnonymousNotifiable, LoginCode::class)->last()->code;
    Notification::shouldReceive('send')
        ->once()
        ->andThrow(new RuntimeException('Mail transport is unavailable.'));

    $this->post('/login/email', ['email' => 'person@atb.dev.br'])
        ->assertSessionHasErrors('email')
        ->assertSessionMissing('auth.login_challenge');
    $this->post('/login', ['code' => $originalCode])->assertSessionHasErrors('code');

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

test('email delivery is rate limited for the same browser', function () {
    foreach (range(1, 3) as $request) {
        $this->post('/login/email', ['email' => "person{$request}@atb.dev.br"])
            ->assertRedirect('/login');
    }

    $this->post('/login/email', ['email' => 'another@atb.dev.br'])->assertTooManyRequests();
    Notification::assertSentOnDemandTimes(LoginCode::class, 3);
});

test('email delivery is rate limited for the normalized recipient across browsers', function () {
    foreach (range(1, 3) as $request) {
        $this->withServerVariables(['REMOTE_ADDR' => "192.0.2.{$request}"])
            ->post('/login/email', ['email' => 'Person@ATB.DEV.BR'])
            ->assertRedirect('/login');
    }

    $this->withServerVariables(['REMOTE_ADDR' => '192.0.2.4'])
        ->post('/login/email', ['email' => 'person@atb.dev.br'])
        ->assertTooManyRequests();
    Notification::assertSentOnDemandTimes(LoginCode::class, 3);
});

test('code verification requests are rate limited', function () {
    foreach (range(1, 10) as $request) {
        $this->post('/login', ['code' => '000000'])->assertSessionHasErrors('code');
    }

    $this->post('/login', ['code' => '000000'])->assertTooManyRequests();
    $this->assertGuest();
});

test('logout invalidates the session and regenerates the csrf token', function () {
    $user = User::factory()->create(['email' => 'person@atb.dev.br']);
    $this->actingAs($user)->withSession(['private-data' => 'value', '_token' => 'previous-token']);
    $sessionId = session()->getId();

    $this->post('/logout')
        ->assertRedirect('/')
        ->assertSessionMissing('private-data');

    $this->assertGuest();
    expect(session()->getId())->not->toBe($sessionId)
        ->and(session()->token())->not->toBe('previous-token');
});

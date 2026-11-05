<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendLoginCodeRequest;
use App\Models\User;
use App\Notifications\LoginCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Head\Facades\Head;
use Throwable;

class EmailLoginController extends Controller
{
    private const string CHALLENGE_KEY = 'auth.login_challenge';

    private const string INVALID_CODE = 'The sign-in code is invalid or has expired.';

    public function create(Request $request): Response
    {
        Head::title('Sign in')->robots('noindex, nofollow');

        $challenge = $this->challenge($request);

        return Inertia::render('auth/Login', [
            'pendingEmail' => $challenge['email'] ?? null,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function send(SendLoginCodeRequest $request): RedirectResponse
    {
        $previous = $this->challenge($request);
        $request->session()->forget(self::CHALLENGE_KEY);

        $transport = config('mail.mailers.'.config('mail.default').'.transport');

        if (! in_array($transport, ['smtp', 'sendmail', 'mailgun', 'ses', 'ses-v2', 'postmark', 'resend'], true)) {
            throw ValidationException::withMessages([
                'email' => 'Email sign-in is unavailable. Please try again later.',
            ]);
        }

        $email = $request->string('email')->toString();
        do {
            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while ($previous !== null && Hash::check($code, $previous['hash']));

        try {
            Notification::route('mail', $email)->notify(new LoginCode($code));
        } catch (Throwable) {
            throw ValidationException::withMessages([
                'email' => 'The sign-in email could not be sent. Please try again later.',
            ]);
        }

        $request->session()->put(self::CHALLENGE_KEY, [
            'email' => $email,
            'hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(10)->timestamp,
            'attempts' => 0,
        ]);

        return to_route('login')->with('status', 'A sign-in code has been sent to your email address.');
    }

    public function store(Request $request): RedirectResponse
    {
        $challenge = $this->challenge($request);

        if ($challenge === null) {
            throw ValidationException::withMessages(['code' => self::INVALID_CODE]);
        }

        $challenge['attempts']++;
        $code = $request->input('code');

        if (! is_string($code) || ! preg_match('/\A[0-9]{6}\z/', $code) || ! Hash::check($code, $challenge['hash'])) {
            if ($challenge['attempts'] >= 5) {
                $request->session()->forget(self::CHALLENGE_KEY);
            } else {
                $request->session()->put(self::CHALLENGE_KEY, $challenge);
            }

            throw ValidationException::withMessages(['code' => self::INVALID_CODE]);
        }

        $request->session()->forget(self::CHALLENGE_KEY);

        $user = User::query()->firstOrCreate(['email' => $challenge['email']], [
            'name' => Str::before($challenge['email'], '@'),
            'password' => Str::random(64),
        ]);

        if ($user->email_verified_at === null) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        Auth::login($user);
        $request->session()->regenerate();

        return to_route('docs.index');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('home');
    }

    /**
     * @return array{email: string, hash: string, expires_at: int, attempts: int}|null
     */
    private function challenge(Request $request): ?array
    {
        /** @var array{email: string, hash: string, expires_at: int, attempts: int}|null $challenge */
        $challenge = $request->session()->get(self::CHALLENGE_KEY);

        if ($challenge !== null && (! User::allowsStaffEmail($challenge['email']) || $challenge['expires_at'] <= now()->timestamp || $challenge['attempts'] >= 5)) {
            $request->session()->forget(self::CHALLENGE_KEY);

            return null;
        }

        return $challenge;
    }
}

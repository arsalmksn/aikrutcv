<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class AdminAuthController extends Controller
{
    /**
     * Display the admin login view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (Auth::check()) {
            return Auth::user()?->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
            'statusType' => $request->session()->get('status_type', 'success'),
            'email' => (string) $request->query('email', old('email', '')),
            'isAdminLogin' => true,
        ]);
    }

    /**
     * Authenticate the admin user session.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ]);
        }

        if (! Auth::validate(['email' => $request->input('email'), 'password' => $request->input('password')])) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! $user->isAdmin()) {
            RateLimiter::clear($throttleKey);

            return redirect()->route('login', ['email' => $request->input('email')])
                ->with('status', 'Akun Anda adalah akun pengguna biasa. Silakan masuk melalui halaman login pengguna.')
                ->with('status_type', 'warning');
        }

        RateLimiter::clear($throttleKey);

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }
}

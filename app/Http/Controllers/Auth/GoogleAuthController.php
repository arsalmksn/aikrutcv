<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirect(): SymfonyRedirectResponse|RedirectResponse
    {
        if (Auth::check()) {
            return Auth::user()?->isAdmin()
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }

        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google and authenticate the session.
     */
    public function callback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::warning('Google OAuth callback failed: '.$e->getMessage());

            return redirect()->route('login')
                ->with('status', 'Proses login dengan Google dibatalkan atau terjadi kesalahan. Silakan coba kembali.')
                ->with('status_type', 'warning');
        }

        $googleEmail = $googleUser->getEmail();
        $googleId = (string) $googleUser->getId();

        if (! $googleEmail || ! $googleId) {
            return redirect()->route('login')
                ->with('status', 'Gagal mengambil informasi akun dari Google. Silakan coba kembali.')
                ->with('status_type', 'error');
        }

        /** @var User|null $user */
        $user = User::where('google_id', $googleId)
            ->orWhere('email', $googleEmail)
            ->first();

        // Enforce administrative safety: prevent admin users from authenticating via standard Google OAuth
        if ($user && $user->isAdmin()) {
            return redirect()->route('admin.login', ['email' => $user->email])
                ->with('status', 'Akun Anda terdaftar sebagai Administrator. Silakan masuk melalui Portal Administrator.')
                ->with('status_type', 'warning');
        }

        $googleAvatar = $googleUser->getAvatar();
        $fallbackAvatar = 'https://ui-avatars.com/api/?name='.urlencode($googleUser->getName() ?: Str::before($googleEmail, '@')).'&background=0284c7&color=fff&size=256';

        if ($user) {
            $user->forceFill([
                'google_id' => $googleId,
                'avatar' => $googleAvatar ?: ($user->avatar ?: $fallbackAvatar),
                'email_verified_at' => $user->email_verified_at ?: now(),
            ])->save();

            if (! $user->profile) {
                $user->profile()->create([
                    'full_name' => $user->name,
                    'email' => $user->email,
                ]);
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName() ?: Str::before($googleEmail, '@'),
                'email' => $googleEmail,
                'google_id' => $googleId,
                'avatar' => $googleAvatar ?: $fallbackAvatar,
                'email_verified_at' => now(),
                'role' => 'user',
            ]);

            $user->profile()->create([
                'full_name' => $user->name,
                'email' => $user->email,
            ]);
        }

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}

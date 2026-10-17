<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        $user = $request->user();

        if ($user && $user->isAdmin()) {
            auth()->guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('admin.login', ['email' => $user->email])
                ->with('status', 'Akun Anda terdaftar sebagai Administrator. Silakan masuk melalui Portal Administrator.')
                ->with('status_type', 'warning');
        }

        if ($user && ! $user->hasCompletedOnboarding()) {
            return redirect()->route('dashboard');
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}

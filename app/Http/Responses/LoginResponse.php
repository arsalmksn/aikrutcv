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
            return redirect()->intended('/admin/dashboard');
        }

        if ($user && ! $user->hasCompletedOnboarding()) {
            return redirect()->route('onboarding');
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Admins bypass user onboarding flow
        if ($user->isAdmin()) {
            return $next($request);
        }

        $isOnboardingRoute = $request->routeIs('onboarding')
            || $request->routeIs('onboarding.*')
            || $request->routeIs('profile.import-cv.*')
            || $request->routeIs('dashboard');

        // If onboarding is NOT completed and user is not on onboarding/dashboard/logout route
        if (! $user->hasCompletedOnboarding()) {
            if (! $isOnboardingRoute && ! $request->routeIs('logout')) {
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Silakan selesaikan langkah onboarding peminatan terlebih dahulu.',
                        'redirect' => route('dashboard'),
                    ], 403);
                }

                return redirect()->route('dashboard');
            }
        }

        // If onboarding IS completed and user visits onboarding without explicit edit request
        if ($user->hasCompletedOnboarding() && $isOnboardingRoute && ! $request->boolean('reconfigure') && $request->isMethod('GET')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}

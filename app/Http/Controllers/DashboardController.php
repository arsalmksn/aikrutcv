<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the user dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        /** @var UserProfile|null $profile */
        $profile = $user ? $user->profile : null;

        return Inertia::render('dashboard', [
            'hasCompletedOnboarding' => $user ? $user->hasCompletedOnboarding() : true,
            'savedPeminatan' => $profile?->field_of_interest ?? [],
            'careerCategories' => OnboardingController::getCareerCategories(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Cv;
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

        $cvsQuery = $user ? $user->cvs()->with('template')->latest('updated_at') : null;
        $totalCvs = $cvsQuery ? (clone $cvsQuery)->count() : 0;
        /** @var Cv|null $lastUpdatedCv */
        $lastUpdatedCv = $cvsQuery ? (clone $cvsQuery)->first() : null;

        $lastUpdatedText = 'Belum ada';
        if ($lastUpdatedCv && $lastUpdatedCv->updated_at) {
            if ($lastUpdatedCv->updated_at->isToday()) {
                $lastUpdatedText = 'Hari ini';
            } elseif ($lastUpdatedCv->updated_at->isYesterday()) {
                $lastUpdatedText = 'Kemarin';
            } else {
                $lastUpdatedText = $lastUpdatedCv->updated_at->translatedFormat('d M Y');
            }
        }

        $recentCvs = $cvsQuery ? (clone $cvsQuery)->take(5)->get()->map(function (Cv $cv) {
            $subtitle = 'Standar ATS';
            if ($cv->updated_at && $cv->updated_at->isToday()) {
                $subtitle = 'Diperbarui hari ini';
            } elseif ($cv->template?->name) {
                $subtitle = $cv->template->name;
            }

            return [
                'id' => $cv->id,
                'title' => $cv->title,
                'subtitle' => $subtitle,
                'template_name' => $cv->template?->name ?? 'Standar ATS',
                'is_published' => (bool) $cv->is_published,
                'status_label' => $cv->is_published ? 'Tersimpan' : 'Draft',
                'updated_at_formatted' => $cv->updated_at ? $cv->updated_at->translatedFormat('d M Y') : '-',
            ];
        })->values() : collect();

        return Inertia::render('dashboard', [
            'hasCompletedOnboarding' => $user ? $user->hasCompletedOnboarding() : true,
            'savedPeminatan' => $profile?->field_of_interest ?? [],
            'careerCategories' => OnboardingController::getCareerCategories(),
            'stats' => [
                'total_cvs' => $totalCvs,
                'total_cvs_formatted' => str_pad((string) $totalCvs, 2, '0', STR_PAD_LEFT),
                'last_updated_time' => $lastUpdatedText,
                'last_updated_cv_title' => $lastUpdatedCv?->title ?? 'Belum ada dokumen',
            ],
            'recentCvs' => $recentCvs,
        ]);
    }
}

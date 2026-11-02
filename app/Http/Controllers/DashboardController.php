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

        $cvsQuery = $user ? $user->cvs()
            ->with(['template', 'contact', 'experiences', 'educations', 'skills', 'summary'])
            ->latest('updated_at') : null;
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

        $recentCvs = $cvsQuery ? (clone $cvsQuery)->take(6)->get()->map(function (Cv $cv) {
            $checklist = $cv->completenessChecklist();
            $completedCount = count(array_filter([
                $checklist['contact'],
                $checklist['experiences'],
                $checklist['educations'],
                $checklist['skills'],
                $checklist['summary'],
            ]));
            $percentage = (int) round(($completedCount / 5) * 100);

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
                'completeness' => [
                    'percentage' => $percentage,
                    'is_complete' => (bool) $checklist['is_complete'],
                ],
                'template' => $cv->template ? [
                    'id' => $cv->template->id,
                    'name' => $cv->template->name,
                    'category' => $cv->template->category,
                ] : null,
                'contact' => $cv->contact ? [
                    'first_name' => $cv->contact->first_name,
                    'last_name' => $cv->contact->last_name,
                    'desired_job_title' => $cv->contact->desired_job_title,
                    'email' => $cv->contact->email,
                    'phone' => $cv->contact->phone,
                    'city' => $cv->contact->city,
                    'address' => $cv->contact->address,
                ] : null,
                'summary' => $cv->summary?->content,
                'experiences' => $cv->experiences->map(fn ($exp) => [
                    'id' => $exp->id,
                    'company_name' => $exp->company_name,
                    'position' => $exp->position,
                    'city' => $exp->city,
                    'start_date' => $exp->start_date,
                    'end_date' => $exp->end_date,
                    'is_current' => (bool) $exp->is_current,
                    'description' => $exp->description,
                ])->values(),
                'educations' => $cv->educations->map(fn ($edu) => [
                    'id' => $edu->id,
                    'institution_name' => $edu->institution_name,
                    'degree' => $edu->degree,
                    'field_of_study' => $edu->field_of_study,
                    'city' => $edu->city,
                    'start_date' => $edu->start_date,
                    'end_date' => $edu->end_date,
                    'is_current' => (bool) $edu->is_current,
                ])->values(),
                'skills' => $cv->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                ])->values(),
            ];
        })->values() : collect();

        $latestCv = $recentCvs->first();

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
            'latestCv' => $latestCv,
        ]);
    }
}

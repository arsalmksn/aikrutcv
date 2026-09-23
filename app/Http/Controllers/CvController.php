<?php

namespace App\Http\Controllers;

use App\Models\Cv;
use App\Models\CvContact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CvController extends Controller
{
    /**
     * Show the CV builder interface.
     */
    public function builder(Request $request, ?Cv $cv = null): Response
    {
        $user = $request->user();

        if ($cv === null) {
            /** @var Cv $cv */
            $cv = Cv::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'title' => 'Curriculum Vitae',
                ],
                [
                    'is_published' => false,
                ]
            );
        } else {
            abort_if($cv->user_id !== $user->id, 403);
        }

        if (! $cv->contact()->exists()) {
            $nameParts = explode(' ', $user->name, 2);
            $cv->contact()->create([
                'first_name' => $nameParts[0] ?? 'arsa',
                'last_name' => $nameParts[1] ?? 'aji',
                'desired_job_title' => 'full',
                'phone' => '+6208888888888',
                'email' => $user->email ?? 'admin@aikrut.com',
            ]);
        }

        $cv->load(['contact', 'template']);

        return Inertia::render('cv/builder', [
            'cv' => $cv,
        ]);
    }

    /**
     * Update or create CV contact information (auto-save endpoint).
     */
    public function updateContact(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'desired_job_title' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'string', 'email', 'max:150'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'linkedin_url' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'string', 'max:255'],
        ]);

        /** @var CvContact $contact */
        $contact = $cv->contact()->updateOrCreate(
            ['cv_id' => $cv->id],
            $validated
        );

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Kontak berhasil disimpan.',
                'contact' => $contact,
            ]);
        }

        return back()->with('success', 'Kontak berhasil disimpan.');
    }
}

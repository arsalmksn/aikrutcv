<?php

namespace App\Http\Controllers;

use App\Models\Cv;
use App\Models\CvContact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

        if ($cv->experiences()->doesntExist()) {
            $cv->experiences()->create([
                'position' => 'RPL',
                'company_name' => 'UDB',
                'city' => 'Surakarta',
                'start_date' => '2026-02-01',
                'end_date' => null,
                'is_current' => false,
                'description' => "• Membantu laporan keuangan bulanan dan entri data\n• Mengawasi anggaran tim dan melaporkan masalah",
                'sort_order' => 0,
            ]);
        }

        if ($cv->educations()->doesntExist()) {
            $cv->educations()->create([
                'institution_name' => 'Universitas Indonesia',
                'degree' => 'Sarjana di Keuangan dan Perbankan',
                'field_of_study' => 'Keuangan dan Perbankan',
                'city' => 'Jakarta',
                'start_date' => null,
                'end_date' => null,
                'is_current' => false,
                'description' => '<p>Lulus dengan predikat cumlaude, IPK 3.85 (2022)</p>',
                'sort_order' => 0,
            ]);
        }

        $cv->load(['contact', 'template', 'experiences', 'educations']);

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

    /**
     * Update or sync CV experiences (auto-save endpoint).
     */
    public function updateExperiences(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'experiences' => ['present', 'array'],
            'experiences.*.id' => ['nullable', 'integer'],
            'experiences.*.company_name' => ['required', 'string', 'max:150'],
            'experiences.*.position' => ['required', 'string', 'max:150'],
            'experiences.*.city' => ['nullable', 'string', 'max:100'],
            'experiences.*.start_date' => ['nullable', 'string', 'max:30'],
            'experiences.*.end_date' => ['nullable', 'string', 'max:30'],
            'experiences.*.is_current' => ['nullable', 'boolean'],
            'experiences.*.description' => ['nullable', 'string'],
            'experiences.*.sort_order' => ['nullable', 'integer'],
        ]);

        $keepIds = [];
        foreach ($validated['experiences'] as $index => $item) {
            $startDate = null;
            if (! empty($item['start_date'])) {
                try {
                    $startDate = preg_match('/^\d{2}\/\d{4}$/', $item['start_date'])
                        ? Carbon::createFromFormat('m/Y', $item['start_date'])->startOfMonth()->toDateString()
                        : Carbon::parse($item['start_date'])->toDateString();
                } catch (\Throwable) {
                    $startDate = null;
                }
            }

            $isCurrent = (bool) ($item['is_current'] ?? false);
            $endDate = null;
            if (! $isCurrent && ! empty($item['end_date'])) {
                try {
                    $endDate = preg_match('/^\d{2}\/\d{4}$/', $item['end_date'])
                        ? Carbon::createFromFormat('m/Y', $item['end_date'])->startOfMonth()->toDateString()
                        : Carbon::parse($item['end_date'])->toDateString();
                } catch (\Throwable) {
                    $endDate = null;
                }
            }

            $data = [
                'company_name' => $item['company_name'],
                'position' => $item['position'],
                'city' => $item['city'] ?? null,
                'start_date' => $startDate,
                'end_date' => $isCurrent ? null : $endDate,
                'is_current' => $isCurrent,
                'description' => $item['description'] ?? null,
                'sort_order' => $item['sort_order'] ?? $index,
            ];

            if (! empty($item['id'])) {
                $exp = $cv->experiences()->where('id', $item['id'])->first();
                if ($exp) {
                    $exp->update($data);
                    $keepIds[] = $exp->id;

                    continue;
                }
            }

            $created = $cv->experiences()->create($data);
            $keepIds[] = $created->id;
        }

        $cv->experiences()->whereNotIn('id', $keepIds)->delete();

        $experiences = $cv->experiences()->orderBy('sort_order', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pengalaman kerja berhasil disimpan.',
                'experiences' => $experiences,
            ]);
        }

        return back()->with('success', 'Pengalaman kerja berhasil disimpan.');
    }

    /**
     * Update or sync CV educations (auto-save endpoint).
     */
    public function updateEducations(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'educations' => ['present', 'array'],
            'educations.*.id' => ['nullable', 'integer'],
            'educations.*.institution_name' => ['required', 'string', 'max:150'],
            'educations.*.degree' => ['nullable', 'string', 'max:150'],
            'educations.*.field_of_study' => ['nullable', 'string', 'max:150'],
            'educations.*.city' => ['nullable', 'string', 'max:100'],
            'educations.*.start_date' => ['nullable', 'string', 'max:30'],
            'educations.*.end_date' => ['nullable', 'string', 'max:30'],
            'educations.*.is_current' => ['nullable', 'boolean'],
            'educations.*.description' => ['nullable', 'string'],
            'educations.*.sort_order' => ['nullable', 'integer'],
        ]);

        $keepIds = [];
        foreach ($validated['educations'] as $index => $item) {
            $startDate = null;
            if (! empty($item['start_date'])) {
                try {
                    $startDate = preg_match('/^\d{2}\/\d{4}$/', $item['start_date'])
                        ? Carbon::createFromFormat('m/Y', $item['start_date'])->startOfMonth()->toDateString()
                        : Carbon::parse($item['start_date'])->toDateString();
                } catch (\Throwable) {
                    $startDate = null;
                }
            }

            $isCurrent = (bool) ($item['is_current'] ?? false);
            $endDate = null;
            if (! $isCurrent && ! empty($item['end_date'])) {
                try {
                    $endDate = preg_match('/^\d{2}\/\d{4}$/', $item['end_date'])
                        ? Carbon::createFromFormat('m/Y', $item['end_date'])->startOfMonth()->toDateString()
                        : Carbon::parse($item['end_date'])->toDateString();
                } catch (\Throwable) {
                    $endDate = null;
                }
            }

            $data = [
                'institution_name' => $item['institution_name'],
                'degree' => $item['degree'] ?? null,
                'field_of_study' => $item['field_of_study'] ?? null,
                'city' => $item['city'] ?? null,
                'start_date' => $startDate,
                'end_date' => $isCurrent ? null : $endDate,
                'is_current' => $isCurrent,
                'description' => $item['description'] ?? null,
                'sort_order' => $item['sort_order'] ?? $index,
            ];

            if (! empty($item['id'])) {
                $edu = $cv->educations()->where('id', $item['id'])->first();
                if ($edu) {
                    $edu->update($data);
                    $keepIds[] = $edu->id;

                    continue;
                }
            }

            $created = $cv->educations()->create($data);
            $keepIds[] = $created->id;
        }

        $cv->educations()->whereNotIn('id', $keepIds)->delete();

        $educations = $cv->educations()->orderBy('sort_order', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pendidikan berhasil disimpan.',
                'educations' => $educations,
            ]);
        }

        return back()->with('success', 'Pendidikan berhasil disimpan.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Cv;
use App\Models\CvContact;
use App\Models\CvSummary;
use App\Models\Template;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CvController extends Controller
{
    /**
     * Display a listing of the user's CVs.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $cvs = $user->cvs()
            ->with(['template', 'contact', 'experiences', 'educations', 'skills', 'summary'])
            ->latest('updated_at')
            ->get()
            ->map(function (Cv $cv) {
                $checklist = $cv->completenessChecklist();
                $completedCount = count(array_filter([
                    $checklist['contact'],
                    $checklist['experiences'],
                    $checklist['educations'],
                    $checklist['skills'],
                    $checklist['summary'],
                ]));
                $percentage = (int) round(($completedCount / 5) * 100);

                return [
                    'id' => $cv->id,
                    'title' => $cv->title,
                    'is_published' => $cv->is_published,
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
                    ]),
                    'educations' => $cv->educations->map(fn ($edu) => [
                        'id' => $edu->id,
                        'institution_name' => $edu->institution_name,
                        'degree' => $edu->degree,
                        'field_of_study' => $edu->field_of_study,
                    ]),
                    'skills' => $cv->skills->map(fn ($skill) => [
                        'id' => $skill->id,
                        'name' => $skill->name,
                    ]),
                    'experiences_count' => $cv->experiences->count(),
                    'educations_count' => $cv->educations->count(),
                    'skills_count' => $cv->skills->count(),
                    'completeness' => [
                        'percentage' => $percentage,
                        'is_complete' => $checklist['is_complete'],
                        'checklist' => $checklist,
                    ],
                    'created_at' => $cv->created_at?->diffForHumans() ?? '',
                    'updated_at' => $cv->updated_at?->diffForHumans() ?? '',
                    'updated_at_formatted' => $cv->updated_at?->format('d M Y, H:i') ?? '',
                ];
            });

        return Inertia::render('cv/index', [
            'cvs' => $cvs,
        ]);
    }

    /**
     * Show the CV template selection interface.
     */
    public function templates(Request $request): Response
    {
        $templates = Template::where('is_active', true)
            ->get()
            ->filter(fn (Template $template) => view()->exists('cv.templates.'.Str::slug($template->name)))
            ->values();

        return Inertia::render('cv/templates', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the CV creation options interface.
     */
    public function options(Request $request): Response
    {
        return Inertia::render('cv/options', [
            'template_id' => $request->integer('template_id') ?: null,
        ]);
    }

    /**
     * Show the CV builder interface.
     */
    public function builder(Request $request, ?Cv $cv = null): Response
    {
        $user = $request->user();

        if ($user === null) {
            $user = User::firstOrCreate(
                ['email' => 'guest@aikrut.com'],
                [
                    'name' => 'Demo User',
                    'password' => bcrypt(Str::random(32)),
                    'email_verified_at' => now(),
                ]
            );
            auth()->login($user);
        }

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
                'first_name' => $nameParts[0] !== '' ? $nameParts[0] : 'arsa',
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

        if ($cv->skills()->doesntExist()) {
            $cv->skills()->create([
                'name' => 'Office 365',
                'level' => null,
                'sort_order' => 0,
            ]);
        }

        if ($cv->summary()->doesntExist()) {
            $cv->summary()->create([
                'content' => 'Profesional berorientasi detail dengan pengalaman 3+ tahun di [bidang]. Terampil dalam [keahlian kunci]. Berusaha untuk berkontribusi pada [jenis tim/perusahaan atau tujuan].',
            ]);
        }

        $templates = Template::where('is_active', true)
            ->get()
            ->filter(fn (Template $template) => view()->exists('cv.templates.'.Str::slug($template->name)))
            ->values();
        if ($request->has('template_id')) {
            $requestedTemplateId = $request->integer('template_id');
            if ($templates->contains('id', $requestedTemplateId)) {
                $cv->template_id = $requestedTemplateId;
                $cv->save();
            }
        } elseif ($cv->template_id === null && $templates->isNotEmpty()) {
            $cv->template_id = $templates->first()->id;
            $cv->save();
        }

        $cv->load(['contact', 'template', 'experiences', 'educations', 'skills', 'summary']);

        return Inertia::render('cv/builder', [
            'cv' => $cv,
            'templates' => $templates,
            'isComplete' => $cv->isComplete(),
            'completenessChecklist' => $cv->completenessChecklist(),
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

    /**
     * Update or sync CV skills (auto-save endpoint).
     */
    public function updateSkills(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'skills' => ['present', 'array'],
            'skills.*.id' => ['nullable', 'integer'],
            'skills.*.name' => ['required', 'string', 'max:150'],
            'skills.*.level' => ['nullable', 'string', 'max:50'],
            'skills.*.sort_order' => ['nullable', 'integer'],
        ]);

        $keepIds = [];
        foreach ($validated['skills'] as $index => $item) {
            $data = [
                'name' => $item['name'],
                'level' => $item['level'] ?? null,
                'sort_order' => $item['sort_order'] ?? $index,
            ];

            if (! empty($item['id'])) {
                $skill = $cv->skills()->where('id', $item['id'])->first();
                if ($skill) {
                    $skill->update($data);
                    $keepIds[] = $skill->id;

                    continue;
                }
            }

            $created = $cv->skills()->create($data);
            $keepIds[] = $created->id;
        }

        $cv->skills()->whereNotIn('id', $keepIds)->delete();

        $skills = $cv->skills()->orderBy('sort_order', 'asc')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Keahlian berhasil disimpan.',
                'skills' => $skills,
            ]);
        }

        return back()->with('success', 'Keahlian berhasil disimpan.');
    }

    /**
     * Update or create CV summary (auto-save endpoint).
     */
    public function updateSummary(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'content' => ['nullable', 'string'],
        ]);

        /** @var CvSummary $summary */
        $summary = $cv->summary()->updateOrCreate(
            ['cv_id' => $cv->id],
            $validated
        );

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Ringkasan berhasil disimpan.',
                'summary' => $summary,
            ]);
        }

        return back()->with('success', 'Ringkasan berhasil disimpan.');
    }

    /**
     * Update the title of the specified CV.
     */
    public function updateTitle(Request $request, Cv $cv): JsonResponse|RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $cv->update(['title' => $validated['title']]);

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Judul CV berhasil diperbarui.',
                'title' => $cv->title,
            ]);
        }

        return back()->with('success', 'Judul CV berhasil diperbarui.');
    }

    /**
     * Duplicate the specified CV and its related records.
     */
    public function duplicate(Request $request, Cv $cv): RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $newCv = $cv->replicate(['is_published']);
        $newCv->title = 'Salinan - '.$cv->title;
        $newCv->is_published = false;
        $newCv->save();

        if ($cv->contact) {
            $newCv->contact()->create($cv->contact->replicate()->toArray());
        }

        if ($cv->summary) {
            $newCv->summary()->create($cv->summary->replicate()->toArray());
        }

        foreach ($cv->experiences as $exp) {
            $newCv->experiences()->create($exp->replicate()->toArray());
        }

        foreach ($cv->educations as $edu) {
            $newCv->educations()->create($edu->replicate()->toArray());
        }

        foreach ($cv->skills as $skill) {
            $newCv->skills()->create($skill->replicate()->toArray());
        }

        return redirect()->route('cv.index')->with('success', 'CV berhasil diduplikasi.');
    }

    /**
     * Remove the specified CV from storage.
     */
    public function destroy(Request $request, Cv $cv): RedirectResponse
    {
        abort_if($cv->user_id !== $request->user()->id, 403);

        $cv->delete();

        return redirect()->route('cv.index')->with('success', 'CV berhasil dihapus.');
    }
}

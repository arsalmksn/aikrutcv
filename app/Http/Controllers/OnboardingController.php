<?php

namespace App\Http\Controllers;

use App\Ai\Agents\CareerOnboardingAgent;
use App\Models\CareerCategory;
use App\Models\CareerRole;
use App\Models\CareerSubCategory;
use App\Models\Cv;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\AiService;
use Database\Seeders\CareerPathSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OnboardingController extends Controller
{
    public function __construct(
        protected AiService $aiService,
        protected CareerOnboardingAgent $onboardingAgent,
    ) {}

    /**
     * Render the interactive AI onboarding page.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user && $user->hasCompletedOnboarding() && ! $request->boolean('reconfigure')) {
            return redirect()->route('dashboard');
        }

        /** @var UserProfile $profile */
        $profile = $this->getOrCreateProfile($user);

        // Fetch user's latest existing CV if available
        /** @var Cv|null $latestCv */
        $latestCv = $user->cvs()
            ->with(['contact', 'experiences', 'educations', 'skills', 'summary'])
            ->latest('updated_at')
            ->first();

        // Detect and aggregate existing data from CV and profile
        $existingExperiences = [];
        if ($latestCv && $latestCv->experiences->isNotEmpty()) {
            foreach ($latestCv->experiences as $exp) {
                $existingExperiences[] = [
                    'company' => $exp->company_name,
                    'position' => $exp->position,
                    'location' => $exp->city,
                    'period' => $exp->start_date ? ($exp->start_date->format('Y-m').($exp->is_current ? ' - Sekarang' : ($exp->end_date ? ' - '.$exp->end_date->format('Y-m') : ''))) : null,
                ];
            }
        } elseif ($profile->experiences->isNotEmpty()) {
            foreach ($profile->experiences as $exp) {
                $existingExperiences[] = [
                    'company' => $exp->company,
                    'position' => $exp->position,
                    'location' => $exp->location,
                    'period' => $exp->start_date.($exp->is_current ? ' - Sekarang' : ($exp->end_date ? ' - '.$exp->end_date : '')),
                ];
            }
        }

        $existingEducations = [];
        if ($latestCv && $latestCv->educations->isNotEmpty()) {
            foreach ($latestCv->educations as $edu) {
                $existingEducations[] = [
                    'institution' => $edu->institution_name,
                    'degree' => $edu->degree,
                    'location' => $edu->city,
                ];
            }
        } elseif ($profile->educations->isNotEmpty()) {
            foreach ($profile->educations as $edu) {
                $existingEducations[] = [
                    'institution' => $edu->institution,
                    'degree' => $edu->degree.($edu->major ? ' ('.$edu->major.')' : ''),
                    'location' => null,
                ];
            }
        }

        $existingTools = [];
        if ($latestCv && $latestCv->skills->isNotEmpty()) {
            $existingTools = $latestCv->skills->pluck('name')->filter()->values()->all();
        }
        if (! empty($profile->tools) && is_array($profile->tools)) {
            $existingTools = array_values(array_unique(array_merge($existingTools, $profile->tools)));
        }

        $existingSummary = $latestCv?->summary?->content ?: $profile->about_me;

        $hasExistingData = $latestCv !== null
            || ! empty($existingExperiences)
            || ! empty($existingEducations)
            || ! empty($existingTools)
            || ! empty($existingSummary);

        $careerCategories = self::getCareerCategories();
        $careerLevels = self::getCareerLevels();

        return Inertia::render('onboarding/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'onboarding_completed_at' => $user->onboarding_completed_at?->toIso8601String(),
            ],
            'existingData' => [
                'has_existing_cv' => $latestCv !== null,
                'latest_cv_title' => $latestCv?->title,
                'experiences' => $existingExperiences,
                'educations' => $existingEducations,
                'tools' => $existingTools,
                'summary' => $existingSummary,
                'saved_peminatan' => $profile->field_of_interest ?: [],
                'saved_career_level' => $profile->career_level,
                'ai_onboarding_context' => $profile->ai_onboarding_context,
            ],
            'careerCategories' => $careerCategories,
            'careerLevels' => $careerLevels,
        ]);
    }

    /**
     * Synthesize and generate an AI career blueprint based on chosen peminatan and existing data.
     */
    public function generateBlueprint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'field_of_interest' => ['required', 'array', 'min:1'],
            'field_of_interest.*' => ['string', 'max:100'],
            'career_level' => ['nullable', 'string', 'max:100'],
            'use_existing_data' => ['nullable', 'boolean'],
            'existing_data' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        /** @var UserProfile $profile */
        $profile = $this->getOrCreateProfile($user);

        try {
            $prompt = $this->onboardingAgent->buildOnboardingPrompt([
                'field_of_interest' => $validated['field_of_interest'],
                'career_level' => $validated['career_level'] ?? 'Fresh Graduate / Mahasiswa',
                'existing_data' => ! empty($validated['use_existing_data']) ? ($validated['existing_data'] ?? []) : null,
            ], $profile, $user);

            $result = $this->aiService->generateWithAgent($this->onboardingAgent, $prompt, [
                'temperature' => 0.4,
                'max_tokens' => 2000,
            ]);

            $rawContent = trim($result['content']);

            // Clean markdown wrappers if any
            if (str_starts_with($rawContent, '```')) {
                $rawContent = preg_replace('/^```(?:json)?\s*/i', '', $rawContent);
                $rawContent = preg_replace('/\s*```$/', '', $rawContent);
            }

            $blueprint = json_decode($rawContent, true);

            if (! is_array($blueprint) || empty($blueprint['target_roles'])) {
                $blueprint = $this->generateFallbackBlueprint($validated['field_of_interest'], $validated['career_level'] ?? null);
            }

            return response()->json([
                'status' => 'success',
                'data' => $blueprint,
            ]);
        } catch (Throwable $e) {
            Log::warning('Onboarding AI generation failed, using fallback blueprint: '.$e->getMessage(), [
                'user_id' => $user->id,
            ]);

            // High-quality deterministic fallback so user flow is never disrupted
            $fallback = $this->generateFallbackBlueprint($validated['field_of_interest'], $validated['career_level'] ?? null);

            return response()->json([
                'status' => 'success',
                'data' => $fallback,
                'fallback' => true,
            ]);
        }
    }

    /**
     * Complete the onboarding flow, persist AI context, and mark user onboarding as complete.
     */
    public function complete(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'field_of_interest' => ['required', 'array', 'min:1'],
            'field_of_interest.*' => ['string', 'max:100'],
            'career_level' => ['nullable', 'string', 'max:100'],
            'profile_data_source' => ['nullable', 'string', 'in:manual,onboarding,cv_import'],
            'sync_existing_cv' => ['nullable', 'boolean'],
            'selected_skills' => ['nullable', 'array'],
            'selected_skills.*' => ['string', 'max:100'],
            'ai_blueprint' => ['nullable', 'array'],
        ]);

        $user = $request->user();
        /** @var UserProfile $profile */
        $profile = $this->getOrCreateProfile($user);

        $fieldOfInterest = array_values(array_unique(array_filter($validated['field_of_interest'])));

        // Strict master data validation: User cannot inject arbitrary roles not in active master
        if (! CareerRole::where('is_active', true)->exists()) {
            $seeder = new CareerPathSeeder;
            $seeder->run();
        }

        $allowedRoleNames = CareerRole::where('is_active', true)->pluck('name')
            ->merge(CareerSubCategory::where('is_active', true)->pluck('name'))
            ->merge(CareerCategory::where('is_active', true)->pluck('name'))
            ->merge(CareerRole::where('is_active', true)->get()->flatMap(fn ($r) => $r->popular_skills ?? []))
            ->merge(CareerSubCategory::where('is_active', true)->get()->flatMap(fn ($sc) => $sc->popular_skills ?? []))
            ->unique()
            ->all();

        $invalidSelections = array_diff($fieldOfInterest, $allowedRoleNames);
        if (! empty($invalidSelections)) {
            throw ValidationException::withMessages([
                'field_of_interest' => 'Peminatan yang dipilih harus berasal dari data master resmi yang tersedia.',
            ]);
        }

        DB::transaction(function () use ($user, $profile, $validated, $fieldOfInterest) {
            $careerLevel = $validated['career_level'] ?? 'Fresh Graduate / Mahasiswa';
            $profileDataSource = $validated['profile_data_source'] ?? 'manual';

            // Merge tools from existing, selected skills, and AI recommendations
            $existingTools = is_array($profile->tools) ? $profile->tools : [];
            $newSkills = $validated['selected_skills'] ?? [];
            $recommendedSkills = $validated['ai_blueprint']['recommended_skills'] ?? [];
            $allTools = array_values(array_unique(array_filter(array_merge($existingTools, $newSkills, $recommendedSkills))));

            $blueprint = $validated['ai_blueprint'] ?? $this->generateFallbackBlueprint($fieldOfInterest, $careerLevel);

            $profileUpdate = [
                'field_of_interest' => $fieldOfInterest,
                'career_level' => $careerLevel,
                'profile_data_source' => $profileDataSource,
                'tools' => $allTools,
                'ai_onboarding_context' => $blueprint,
            ];

            $profile->update($profileUpdate);

            // Sync CV data to Profile if requested and CV exists
            if (! empty($validated['sync_existing_cv'])) {
                $this->syncCvDataToProfile($user, $profile);
            }

            // Mark user onboarding as completed
            $user->completeOnboarding();
        });

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Onboarding peminatan berhasil disimpan. AI Assistant Anda telah siap!',
                'redirect' => route('profile.index'),
            ]);
        }

        return redirect()->route('profile.index');
    }

    /**
     * Skip onboarding with default settings.
     */
    public function skip(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var UserProfile $profile */
        $profile = $this->getOrCreateProfile($user);

        if (empty($profile->field_of_interest)) {
            $profile->update([
                'field_of_interest' => ['Umum / General'],
                'career_level' => 'Fresh Graduate / Mahasiswa',
                'profile_data_source' => 'onboarding',
            ]);
        }

        $user->completeOnboarding();

        return redirect()->route('profile.index');
    }

    /**
     * Copy missing experiences & educations from latest CV into UserProfile master.
     */
    protected function syncCvDataToProfile(User $user, UserProfile $profile): void
    {
        /** @var Cv|null $cv */
        $cv = $user->cvs()->with(['experiences', 'educations', 'contact'])->latest('updated_at')->first();
        if (! $cv) {
            return;
        }

        if ($profile->experiences()->count() === 0 && $cv->experiences->isNotEmpty()) {
            foreach ($cv->experiences as $index => $exp) {
                $profile->experiences()->create([
                    'company' => $exp->company_name,
                    'position' => $exp->position,
                    'location' => $exp->city,
                    'start_date' => $exp->start_date ? $exp->start_date->format('Y-m') : now()->format('Y-m'),
                    'end_date' => $exp->is_current ? null : ($exp->end_date ? $exp->end_date->format('Y-m') : null),
                    'is_current' => (bool) $exp->is_current,
                    'description' => $exp->description ? (is_array($exp->description) ? $exp->description : [$exp->description]) : [],
                    'sort_order' => $index,
                ]);
            }
        }

        if ($profile->educations()->count() === 0 && $cv->educations->isNotEmpty()) {
            foreach ($cv->educations as $index => $edu) {
                $profile->educations()->create([
                    'institution' => $edu->institution_name,
                    'degree' => $edu->degree,
                    'start_date' => $edu->start_date ? $edu->start_date->format('Y-m') : null,
                    'end_date' => $edu->end_date ? $edu->end_date->format('Y-m') : null,
                    'gpa' => null,
                    'sort_order' => $index,
                ]);
            }
        }
    }

    /**
     * Retrieve or instantiate default UserProfile.
     */
    protected function getOrCreateProfile(User $user): UserProfile
    {
        /** @var UserProfile $profile */
        $profile = $user->profile()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => $user->name,
                'email' => $user->email,
                'field_of_interest' => [],
                'employment_type' => ['Full-time'],
                'tools' => [],
            ]
        );

        $profile->load(['experiences', 'educations']);

        return $profile;
    }

    /**
     * Fallback deterministic blueprint generator.
     *
     * @param  array<int, string>  $fields
     * @return array<string, mixed>
     */
    protected function generateFallbackBlueprint(array $fields, ?string $level): array
    {
        $primaryField = $fields[0] ?? 'Teknologi & Bisnis';
        $levelText = $level ?: 'Entry Level';

        return [
            'ai_profile_summary' => "Profesional berorientasi hasil dengan fokus peminatan pada {$primaryField}. Memiliki dedikasi tinggi dalam mengembangkan kompetensi teknis, siap memberikan kontribusi nyata serta memecahkan tantangan industri.",
            'target_roles' => array_slice(array_merge($fields, ["{$primaryField} Specialist", "Associate {$primaryField}"]), 0, 4),
            'recommended_skills' => [
                'Problem Solving',
                'Analisis Kritis',
                'Komunikasi Profesional',
                'Manajemen Proyek',
                'Tools Spesialisasi '.$primaryField,
            ],
            'quick_action_steps' => [
                "Cantumkan kata kunci relevan '{$primaryField}' pada ringkasan dan pengalaman CV Anda.",
                'Fokuskan deskripsi tanggung jawab pada pencapaian terukur dengan action verbs yang kuat.',
                'Lakukan peninjauan ATS dengan AI Reviewer sebelum melamar posisi impian.',
            ],
            'tailored_tone' => 'professional',
            'career_level' => $levelText,
            'readiness_note' => "Profil Anda siap dioptimalkan untuk posisi terkait {$primaryField}.",
        ];
    }

    /**
     * Get career categories and roles list.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function getCareerCategories(): array
    {
        $categories = CareerCategory::query()
            ->active()
            ->with([
                'subCategories' => function ($query): void {
                    $query->active()
                        ->orderBy('sort_order', 'asc')
                        ->orderBy('id', 'asc')
                        ->with(['roles' => function ($roleQuery): void {
                            $roleQuery->active()->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
                        }]);
                },
            ])
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        if ($categories->isEmpty()) {
            $seeder = new CareerPathSeeder;
            $seeder->run();
            $categories = CareerCategory::query()
                ->active()
                ->with([
                    'subCategories' => function ($query): void {
                        $query->active()
                            ->orderBy('sort_order', 'asc')
                            ->orderBy('id', 'asc')
                            ->with(['roles' => function ($roleQuery): void {
                                $roleQuery->active()->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
                            }]);
                    },
                ])
                ->orderBy('sort_order', 'asc')
                ->orderBy('id', 'asc')
                ->get();
        }

        return $categories->map(function (CareerCategory $category): array {
            $allRoles = [];
            $allSkills = [];

            $subCategories = $category->subCategories->map(function ($sub) use (&$allRoles, &$allSkills): array {
                $subRoles = $sub->roles->map(fn ($r) => [
                    'id' => $r->slug ?: (string) $r->id,
                    'db_id' => $r->id,
                    'name' => $r->name,
                    'slug' => $r->slug,
                    'popular_skills' => $r->popular_skills ?? [],
                ])->all();

                $subSkills = $sub->popular_skills ?? [];

                foreach ($sub->roles as $r) {
                    $allRoles[] = $r->name;
                    if (! empty($r->popular_skills)) {
                        $subSkills = array_merge($subSkills, $r->popular_skills);
                    }
                }

                $subSkills = array_values(array_unique(array_filter($subSkills)));
                $allSkills = array_merge($allSkills, $subSkills);

                return [
                    'id' => $sub->slug ?: (string) $sub->id,
                    'db_id' => $sub->id,
                    'name' => $sub->name,
                    'slug' => $sub->slug,
                    'description' => $sub->description,
                    'popular_skills' => $subSkills,
                    'roles' => $subRoles,
                ];
            })->all();

            return [
                'id' => $category->slug ?: (string) $category->id,
                'db_id' => $category->id,
                'title' => $category->name,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description ?? '',
                'icon' => $category->icon ?: 'Briefcase',
                'roles' => array_values(array_unique($allRoles)),
                'popular_skills' => array_values(array_unique(array_slice($allSkills, 0, 10))),
                'sub_categories' => $subCategories,
            ];
        })->all();
    }

    /**
     * Get career levels list.
     *
     * @return array<int, string>
     */
    public static function getCareerLevels(): array
    {
        return [
            'Fresh Graduate / Mahasiswa',
            'Junior (1 - 2 tahun)',
            'Mid-Level (3 - 5 tahun)',
            'Senior (5+ tahun)',
            'Career Switcher / Transisi Karier',
        ];
    }
}

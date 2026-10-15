<?php

namespace App\Http\Controllers;

use App\Ai\Agents\JobRecommendationAgent;
use App\Ai\Agents\ProfileScoringAgent;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\AiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class UserProfileController extends Controller
{
    /**
     * Render the Overview Profile Inertia page or return JSON.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        if ($request->wantsJson() && ! $request->header('X-Inertia')) {
            return response()->json([
                'status' => 'success',
                'data' => $this->formatProfileResponse($profile),
            ]);
        }

        return Inertia::render('profile/index', [
            'initialProfile' => $this->formatProfileResponse($profile),
        ]);
    }

    /**
     * Get profile data in JSON format (GET /api/v1/profile).
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        return response()->json([
            'status' => 'success',
            'data' => $this->formatProfileResponse($profile),
        ]);
    }

    /**
     * Update profile data partially per section or full (PATCH /api/v1/profile).
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        $section = $request->input('section');

        switch ($section) {
            case 'profile':
                $validated = $request->validate([
                    'full_name' => ['nullable', 'string', 'max:255'],
                    'whatsapp_number' => ['nullable', 'string', 'max:50'],
                    'email' => ['nullable', 'email', 'max:255'],
                    'location' => ['nullable', 'string', 'max:255'],
                    'linkedin_url' => ['nullable', 'string', 'max:255'],
                    'age' => ['nullable', 'integer', 'min:1', 'max:120'],
                    'gender' => ['nullable', 'string', Rule::in(['Laki-laki', 'Perempuan'])],
                ]);
                $profile->update($validated);
                break;

            case 'summary':
                $validated = $request->validate([
                    'about_me' => ['nullable', 'string'],
                ]);
                $profile->update($validated);
                break;

            case 'preferences':
                $validated = $request->validate([
                    'field_of_interest' => ['nullable', 'array'],
                    'field_of_interest.*' => ['string'],
                    'employment_type' => ['nullable', 'array'],
                    'employment_type.*' => ['string'],
                    'expected_monthly_salary' => ['nullable', 'array'],
                    'expected_monthly_salary.currency' => ['nullable', 'string', 'max:10'],
                    'expected_monthly_salary.amount' => ['nullable'],
                    'expected_monthly_salary.min_amount' => ['nullable'],
                    'expected_monthly_salary.max_amount' => ['nullable'],
                    'expected_monthly_salary.range_text' => ['nullable', 'string', 'max:100'],
                ]);
                $profile->update($validated);
                break;

            case 'skills':
                $validated = $request->validate([
                    'tools' => ['nullable', 'array'],
                    'tools.*' => ['string'],
                ]);
                $profile->update($validated);
                break;

            case 'portfolio':
                $validated = $request->validate([
                    'portfolio_link' => ['nullable', 'string', 'max:255'],
                    'linkedin_url' => ['nullable', 'string', 'max:255'],
                    'social_links' => ['nullable', 'array'],
                ]);
                $profile->update($validated);
                break;

            case 'experiences':
                $validated = $request->validate([
                    'experiences' => ['present', 'array'],
                    'experiences.*.id' => ['nullable', 'integer'],
                    'experiences.*.company' => ['required', 'string', 'max:255'],
                    'experiences.*.position' => ['required', 'string', 'max:255'],
                    'experiences.*.location' => ['nullable', 'string', 'max:255'],
                    'experiences.*.start_date' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
                    'experiences.*.end_date' => ['nullable', 'string', 'regex:/^\d{4}-\d{2}$/'],
                    'experiences.*.is_current' => ['nullable', 'boolean'],
                    'experiences.*.description' => ['nullable', 'array'],
                    'experiences.*.description.*' => ['string'],
                ]);

                $incomingIds = [];
                foreach ($validated['experiences'] as $index => $item) {
                    $itemData = [
                        'company' => $item['company'],
                        'position' => $item['position'],
                        'location' => $item['location'] ?? null,
                        'start_date' => $item['start_date'],
                        'end_date' => ($item['is_current'] ?? false) ? null : ($item['end_date'] ?? null),
                        'is_current' => (bool) ($item['is_current'] ?? false),
                        'description' => array_values(array_filter($item['description'] ?? [])),
                        'sort_order' => $index,
                    ];

                    if (! empty($item['id'])) {
                        $profile->experiences()->where('id', $item['id'])->update($itemData);
                        $incomingIds[] = $item['id'];
                    } else {
                        $created = $profile->experiences()->create($itemData);
                        $incomingIds[] = $created->id;
                    }
                }
                $profile->experiences()->whereNotIn('id', $incomingIds)->delete();
                break;

            case 'educations':
                $validated = $request->validate([
                    'educations' => ['present', 'array'],
                    'educations.*.id' => ['nullable', 'integer'],
                    'educations.*.institution' => ['required', 'string', 'max:255'],
                    'educations.*.degree' => ['required', 'string', 'max:255'],
                    'educations.*.major' => ['nullable', 'string', 'max:255'],
                    'educations.*.start_date' => ['nullable', 'string'],
                    'educations.*.end_date' => ['nullable', 'string'],
                    'educations.*.gpa' => ['nullable', 'string', 'max:20'],
                ]);

                $incomingIds = [];
                foreach ($validated['educations'] as $index => $item) {
                    $itemData = [
                        'institution' => $item['institution'],
                        'degree' => $item['degree'],
                        'major' => $item['major'] ?? null,
                        'start_date' => $item['start_date'] ?? null,
                        'end_date' => $item['end_date'] ?? null,
                        'gpa' => $item['gpa'] ?? null,
                        'sort_order' => $index,
                    ];

                    if (! empty($item['id'])) {
                        $profile->educations()->where('id', $item['id'])->update($itemData);
                        $incomingIds[] = $item['id'];
                    } else {
                        $created = $profile->educations()->create($itemData);
                        $incomingIds[] = $created->id;
                    }
                }
                $profile->educations()->whereNotIn('id', $incomingIds)->delete();
                break;

            case 'organizations':
                $validated = $request->validate([
                    'organizations' => ['present', 'array'],
                    'organizations.*.id' => ['nullable', 'integer'],
                    'organizations.*.organizations_name' => ['required', 'string', 'max:255'],
                    'organizations.*.role' => ['required', 'string', 'max:255'],
                    'organizations.*.start_date' => ['nullable', 'string'],
                    'organizations.*.end_date' => ['nullable', 'string'],
                    'organizations.*.duration' => ['nullable', 'string', 'max:100'],
                    'organizations.*.description' => ['nullable', 'array'],
                    'organizations.*.description.*' => ['string'],
                ]);

                $incomingIds = [];
                foreach ($validated['organizations'] as $index => $item) {
                    $itemData = [
                        'organizations_name' => $item['organizations_name'],
                        'role' => $item['role'],
                        'start_date' => $item['start_date'] ?? null,
                        'end_date' => $item['end_date'] ?? null,
                        'duration' => $item['duration'] ?? null,
                        'description' => array_values(array_filter($item['description'] ?? [])),
                        'sort_order' => $index,
                    ];

                    if (! empty($item['id'])) {
                        $profile->organizations()->where('id', $item['id'])->update($itemData);
                        $incomingIds[] = $item['id'];
                    } else {
                        $created = $profile->organizations()->create($itemData);
                        $incomingIds[] = $created->id;
                    }
                }
                $profile->organizations()->whereNotIn('id', $incomingIds)->delete();
                break;

            case 'certifications':
                $validated = $request->validate([
                    'certifications' => ['present', 'array'],
                    'certifications.*.id' => ['nullable', 'integer'],
                    'certifications.*.name' => ['required', 'string', 'max:255'],
                    'certifications.*.issuer' => ['required', 'string', 'max:255'],
                    'certifications.*.issue_date' => ['nullable', 'string'],
                    'certifications.*.expiration_date' => ['nullable', 'string'],
                    'certifications.*.validity_period' => ['nullable', 'string', 'max:100'],
                ]);

                $incomingIds = [];
                foreach ($validated['certifications'] as $index => $item) {
                    $itemData = [
                        'name' => $item['name'],
                        'issuer' => $item['issuer'],
                        'issue_date' => $item['issue_date'] ?? null,
                        'expiration_date' => $item['expiration_date'] ?? null,
                        'validity_period' => $item['validity_period'] ?? null,
                        'sort_order' => $index,
                    ];

                    if (! empty($item['id'])) {
                        $profile->certifications()->where('id', $item['id'])->update($itemData);
                        $incomingIds[] = $item['id'];
                    } else {
                        $created = $profile->certifications()->create($itemData);
                        $incomingIds[] = $created->id;
                    }
                }
                $profile->certifications()->whereNotIn('id', $incomingIds)->delete();
                break;

            case 'awards':
                $validated = $request->validate([
                    'awards' => ['present', 'array'],
                    'awards.*.id' => ['nullable', 'integer'],
                    'awards.*.title' => ['required', 'string', 'max:255'],
                    'awards.*.subtitle' => ['nullable', 'string', 'max:255'],
                    'awards.*.year' => ['nullable', 'string', 'max:20'],
                    'awards.*.description' => ['nullable', 'string'],
                ]);

                $incomingIds = [];
                foreach ($validated['awards'] as $index => $item) {
                    $itemData = [
                        'title' => $item['title'],
                        'subtitle' => $item['subtitle'] ?? null,
                        'year' => $item['year'] ?? null,
                        'description' => $item['description'] ?? null,
                        'sort_order' => $index,
                    ];

                    if (! empty($item['id'])) {
                        $profile->awards()->where('id', $item['id'])->update($itemData);
                        $incomingIds[] = $item['id'];
                    } else {
                        $created = $profile->awards()->create($itemData);
                        $incomingIds[] = $created->id;
                    }
                }
                $profile->awards()->whereNotIn('id', $incomingIds)->delete();
                break;

            default:
                // General update when no specific section key or broad update
                $validated = $request->validate([
                    'full_name' => ['nullable', 'string', 'max:255'],
                    'whatsapp_number' => ['nullable', 'string', 'max:50'],
                    'email' => ['nullable', 'email', 'max:255'],
                    'location' => ['nullable', 'string', 'max:255'],
                    'age' => ['nullable', 'integer', 'min:1', 'max:120'],
                    'gender' => ['nullable', 'string', Rule::in(['Laki-laki', 'Perempuan'])],
                    'about_me' => ['nullable', 'string'],
                    'portfolio_link' => ['nullable', 'string', 'max:255'],
                    'field_of_interest' => ['nullable', 'array'],
                    'employment_type' => ['nullable', 'array'],
                    'expected_monthly_salary' => ['nullable', 'array'],
                    'tools' => ['nullable', 'array'],
                ]);
                $profile->update($validated);
                break;
        }

        $profile->refresh();
        $profile->load(['experiences', 'educations', 'organizations', 'certifications', 'awards', 'resumes', 'attachments']);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui.',
            'data' => $this->formatProfileResponse($profile),
        ]);
    }

    /**
     * Upload resume or portfolio attachment (POST /api/v1/profile/upload).
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,docx,doc', 'max:5120'], // Max 5MB
            'type' => ['required', 'string', Rule::in(['resume', 'attachment'])],
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        $file = $request->file('file');
        $type = $request->input('type');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $size = $file->getSize();

        $folder = $type === 'resume' ? 'profiles/resumes' : 'profiles/attachments';
        $storedPath = $file->store($folder, 'public');
        $fileUrl = Storage::disk('public')->url($storedPath);

        if ($type === 'resume') {
            $resume = $profile->resumes()->create([
                'file_name' => $originalName,
                'file_path' => $storedPath,
                'file_url' => $fileUrl,
                'file_size' => $size,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Berkas resume berhasil diunggah.',
                'data' => [
                    'id' => $resume->id,
                    'file_name' => $resume->file_name,
                    'file_url' => $resume->file_url,
                    'file_size' => $resume->file_size,
                    'uploaded_at' => $resume->created_at?->format('d M Y H:i'),
                ],
            ]);
        }

        $attachment = $profile->attachments()->create([
            'title' => $request->input('title') ?: pathinfo($originalName, PATHINFO_FILENAME),
            'file_name' => $originalName,
            'file_path' => $storedPath,
            'file_url' => $fileUrl,
            'file_type' => strtolower($extension),
            'file_size' => $size,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Berkas lampiran berhasil diunggah.',
            'data' => [
                'id' => $attachment->id,
                'title' => $attachment->title,
                'file_name' => $attachment->file_name,
                'file_url' => $attachment->file_url,
                'file_type' => $attachment->file_type,
                'file_size' => $attachment->file_size,
                'uploaded_at' => $attachment->created_at?->format('d M Y H:i'),
            ],
        ]);
    }

    /**
     * Delete an individual entry or file (DELETE /api/v1/profile/items/{type}/{id}).
     */
    public function destroyItem(Request $request, string $type, int $id): JsonResponse
    {
        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        switch ($type) {
            case 'experience':
                $item = $profile->experiences()->findOrFail($id);
                $item->delete();
                break;

            case 'education':
                $item = $profile->educations()->findOrFail($id);
                $item->delete();
                break;

            case 'organization':
                $item = $profile->organizations()->findOrFail($id);
                $item->delete();
                break;

            case 'certification':
                $item = $profile->certifications()->findOrFail($id);
                $item->delete();
                break;

            case 'award':
                $item = $profile->awards()->findOrFail($id);
                $item->delete();
                break;

            case 'resume':
                $item = $profile->resumes()->findOrFail($id);
                if (Storage::disk('public')->exists($item->file_path)) {
                    Storage::disk('public')->delete($item->file_path);
                }
                $item->delete();
                break;

            case 'attachment':
                $item = $profile->attachments()->findOrFail($id);
                if (Storage::disk('public')->exists($item->file_path)) {
                    Storage::disk('public')->delete($item->file_path);
                }
                $item->delete();
                break;

            default:
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tipe item tidak valid.',
                ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Item berhasil dihapus.',
        ]);
    }

    /**
     * Generate or refresh job recommendations based on user's profile using AI.
     */
    public function recommendJobs(Request $request, AiService $aiService, JobRecommendationAgent $agent): JsonResponse
    {
        $validated = $request->validate([
            'career_level' => ['nullable', 'string', Rule::in(['all', 'Junior', 'Mid-Level', 'Senior'])],
            'work_mode' => ['nullable', 'string', Rule::in(['all', 'Remote', 'Hybrid', 'Onsite'])],
        ]);

        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        // Load relations needed for comprehensive profile analysis
        $profile->load([
            'experiences',
            'educations',
            'organizations',
            'certifications',
            'awards',
        ]);

        try {
            $prompt = $agent->buildPrompt($profile, $validated);

            $result = $aiService->generateWithAgent($agent, $prompt, [
                'temperature' => 0.4,
                'max_tokens' => 3000,
            ]);

            $content = trim($result['content']);

            // Strip markdown codeblocks if wrapped in ```json ... ```
            $cleanJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $content);
            $cleanJson = trim($cleanJson);

            if (! str_starts_with($cleanJson, '{')) {
                $startPos = strpos($cleanJson, '{');
                $endPos = strrpos($cleanJson, '}');
                if ($startPos !== false && $endPos !== false && $endPos > $startPos) {
                    $cleanJson = substr($cleanJson, $startPos, $endPos - $startPos + 1);
                }
            }

            $parsed = json_decode($cleanJson, true);

            if (! is_array($parsed) || empty($parsed['recommendations']) || ! is_array($parsed['recommendations'])) {
                Log::warning('AI Job Recommendations returned invalid format: '.$content);

                return response()->json([
                    'status' => 'error',
                    'message' => 'AI menghasilkan format rekomendasi yang tidak valid. Silakan coba lagi.',
                ], 422);
            }

            // Enrich recommendations with direct search portal links
            $location = trim((string) ($profile->location ?: 'Indonesia'));
            $encodedLocation = urlencode($location);

            foreach ($parsed['recommendations'] as &$item) {
                $keywords = trim((string) ($item['search_keywords'] ?? $item['job_title'] ?? ''));
                $encodedKeywords = urlencode($keywords);

                $item['search_links'] = [
                    'linkedin' => "https://www.linkedin.com/jobs/search/?keywords={$encodedKeywords}&location={$encodedLocation}",
                    'jobstreet' => "https://id.jobstreet.com/jobs?keywords={$encodedKeywords}",
                    'glints' => "https://glints.com/id/opportunities/jobs/explore?keyword={$encodedKeywords}",
                    'kalibrr' => "https://www.kalibrr.com/job-board/te/{$encodedKeywords}",
                ];
            }
            unset($item);

            // Persist to database
            $profile->update([
                'job_recommendations' => $parsed,
                'job_recommendations_updated_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Rekomendasi lowongan kerja berhasil diperbarui.',
                'data' => [
                    'recommendations_data' => $parsed,
                    'updated_at' => $profile->job_recommendations_updated_at?->format('d M Y H:i'),
                    'profile' => $this->formatProfileResponse($profile),
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Job recommendation failed: '.$e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghasilkan rekomendasi: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Audit and score user profile using AI (Senior Recruiter Analysis).
     */
    public function scoreProfileWithAi(Request $request, AiService $aiService, ProfileScoringAgent $agent): JsonResponse
    {
        $user = $request->user();
        $profile = $this->getOrCreateProfile($user);

        // Load relations needed for comprehensive profile analysis
        $profile->load([
            'experiences',
            'educations',
            'organizations',
            'certifications',
            'awards',
            'resumes',
            'attachments',
        ]);

        try {
            $prompt = $agent->buildPrompt($profile);

            $result = $aiService->generateWithAgent($agent, $prompt, [
                'temperature' => 0.3,
                'max_tokens' => 3000,
            ]);

            $content = trim($result['content']);

            // Strip markdown codeblocks if wrapped in ```json ... ```
            $cleanJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $content);
            $cleanJson = trim($cleanJson);

            if (! str_starts_with($cleanJson, '{')) {
                $startPos = strpos($cleanJson, '{');
                $endPos = strrpos($cleanJson, '}');
                if ($startPos !== false && $endPos !== false && $endPos > $startPos) {
                    $cleanJson = substr($cleanJson, $startPos, $endPos - $startPos + 1);
                }
            }

            $parsed = json_decode($cleanJson, true);

            if (! is_array($parsed) || ! isset($parsed['overall_score'])) {
                Log::warning('AI Profile Scoring returned invalid format: '.$content);

                return response()->json([
                    'status' => 'error',
                    'message' => 'AI menghasilkan format skor yang tidak valid. Silakan coba lagi.',
                ], 422);
            }

            // Persist to database
            $profile->update([
                'ai_scoring' => $parsed,
                'ai_scoring_updated_at' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Penilaian skor profil AI berhasil diperbarui.',
                'data' => [
                    'scoring_data' => $parsed,
                    'updated_at' => $profile->ai_scoring_updated_at?->format('d M Y H:i'),
                    'profile' => $this->formatProfileResponse($profile),
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('Profile AI Scoring failed: '.$e->getMessage(), [
                'user_id' => $user->id,
                'exception' => $e,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menilai profil: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve or instantiate default UserProfile.
     */
    private function getOrCreateProfile(User $user): UserProfile
    {
        /** @var UserProfile $profile */
        $profile = $user->profile()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'full_name' => $user->name,
                'email' => $user->email,
                'field_of_interest' => [],
                'employment_type' => ['Full-time'],
                'expected_monthly_salary' => [
                    'currency' => 'IDR',
                    'range_text' => '',
                    'amount' => 0,
                ],
                'tools' => [],
            ]
        );

        $profile->load([
            'experiences',
            'educations',
            'organizations',
            'certifications',
            'awards',
            'resumes',
            'attachments',
        ]);

        return $profile;
    }

    /**
     * Standardized formatted array for profile.
     *
     * @return array<string, mixed>
     */
    private function formatProfileResponse(UserProfile $profile): array
    {
        return [
            'id' => $profile->id,
            'user_id' => $profile->user_id,
            'full_name' => $profile->full_name ?: ($profile->user->name ?? ''),
            'whatsapp_number' => $profile->whatsapp_number ?: '',
            'email' => $profile->email ?: ($profile->user->email ?? ''),
            'location' => $profile->location ?: '',
            'age' => $profile->age,
            'gender' => $profile->gender ?: '',
            'about_me' => $profile->about_me ?: '',
            'career_level' => $profile->career_level ?: '',
            'portfolio_link' => $profile->portfolio_link ?: '',
            'linkedin_url' => $profile->linkedin_url ?: '',
            'social_links' => $profile->social_links ?: [],
            'field_of_interest' => $profile->field_of_interest ?: [],
            'employment_type' => $profile->employment_type ?: [],
            'expected_monthly_salary' => $profile->expected_monthly_salary ?: [
                'currency' => 'IDR',
                'amount' => '',
                'min_amount' => '',
                'max_amount' => '',
                'range_text' => '',
            ],
            'tools' => $profile->tools ?: [],
            'job_recommendations' => $profile->job_recommendations,
            'job_recommendations_updated_at' => $profile->job_recommendations_updated_at?->format('d M Y H:i'),
            'ai_scoring' => $profile->ai_scoring,
            'ai_scoring_updated_at' => $profile->ai_scoring_updated_at?->format('d M Y H:i'),
            'ai_onboarding_context' => $profile->ai_onboarding_context,
            'profile_data_source' => $profile->profile_data_source,
            'is_cv_import_locked' => $profile->isCvImportLocked(),
            'experiences' => $profile->experiences->map(fn ($e) => [
                'id' => $e->id,
                'company' => $e->company,
                'position' => $e->position,
                'location' => $e->location ?: '',
                'start_date' => $e->start_date,
                'end_date' => $e->end_date ?: '',
                'is_current' => (bool) $e->is_current,
                'description' => is_array($e->description) ? array_values(array_filter($e->description)) : ($e->description ? [$e->description] : []),
                'sort_order' => $e->sort_order,
            ])->values()->all(),
            'educations' => $profile->educations->map(fn ($ed) => [
                'id' => $ed->id,
                'institution' => $ed->institution,
                'degree' => $ed->degree,
                'major' => $ed->major ?: '',
                'start_date' => $ed->start_date ?: '',
                'end_date' => $ed->end_date ?: '',
                'gpa' => $ed->gpa ?: '',
                'sort_order' => $ed->sort_order,
            ])->values()->all(),
            'organizations' => $profile->organizations->map(fn ($o) => [
                'id' => $o->id,
                'organizations_name' => $o->organizations_name,
                'role' => $o->role,
                'start_date' => $o->start_date ?: '',
                'end_date' => $o->end_date ?: '',
                'duration' => $o->duration ?: '',
                'description' => is_array($o->description) ? array_values(array_filter($o->description)) : ($o->description ? [$o->description] : []),
                'sort_order' => $o->sort_order,
            ])->values()->all(),
            'certifications' => $profile->certifications->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'issuer' => $c->issuer,
                'issue_date' => $c->issue_date ?: '',
                'expiration_date' => $c->expiration_date ?: '',
                'validity_period' => $c->validity_period ?: '',
                'sort_order' => $c->sort_order,
            ])->values()->all(),
            'awards' => $profile->awards->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'subtitle' => $a->subtitle ?: '',
                'year' => $a->year ?: '',
                'description' => $a->description ?: '',
                'sort_order' => $a->sort_order,
            ])->values()->all(),
            'resumes' => $profile->resumes->map(fn ($r) => [
                'id' => $r->id,
                'file_name' => $r->file_name,
                'file_url' => $r->file_url,
                'file_size' => $r->file_size,
                'uploaded_at' => $r->created_at?->format('d M Y H:i'),
            ])->values()->all(),
            'attachments' => $profile->attachments->map(fn ($at) => [
                'id' => $at->id,
                'title' => $at->title,
                'file_name' => $at->file_name,
                'file_url' => $at->file_url,
                'file_type' => $at->file_type,
                'file_size' => $at->file_size,
                'uploaded_at' => $at->created_at?->format('d M Y H:i'),
            ])->values()->all(),
            'total_experience' => $profile->calculateTotalExperience(),
            'latest_education' => $profile->resolveLatestEducation(),
            'completeness' => $profile->calculateCompleteness(),
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Ai\Agents\CvImportAgent;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\AiService;
use App\Services\DocumentTextExtractorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Throwable;

class ProfileCvImportController extends Controller
{
    public function __construct(
        protected DocumentTextExtractorService $textExtractor,
        protected AiService $aiService,
        protected CvImportAgent $cvImportAgent,
        protected UserProfileController $userProfileController
    ) {}

    /**
     * Parse an uploaded CV document (PDF or DOCX) and enhance its contents using AI.
     */
    public function parse(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            /** @var UserProfile $profile */
            $profile = $this->getOrCreateProfile($user);
            if ($profile->isCvImportLocked()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Impor CV di halaman profil tidak dapat dilakukan karena sumber data profil Anda telah dikunci pada saat onboarding.',
                ], 403);
            }
        }

        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,docx', 'max:10240'], // Max 10MB
            'tone' => ['nullable', 'string', Rule::in(['professional', 'concise', 'impactful'])],
        ]);

        $file = $request->file('file');
        $tone = $request->input('tone') ?: 'professional';

        try {
            // Step 1: Extract plain text from document
            $rawText = $this->textExtractor->extract($file);
        } catch (Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }

        try {
            // Step 2: Build AI prompt and execute through fallback chain
            $prompt = $this->cvImportAgent->buildImportPrompt($rawText, $tone);

            $result = $this->aiService->generateWithAgent($this->cvImportAgent, $prompt, [
                'temperature' => 0.4,
                'max_tokens' => 3500,
            ]);

            $content = trim($result['content']);

            // Strip markdown codeblocks if AI wraps in ```json ... ```
            $cleanJson = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $content);
            $cleanJson = trim($cleanJson);

            // In case there is any leading/trailing explanatory text before/after JSON
            if (! str_starts_with($cleanJson, '{')) {
                $startPos = strpos($cleanJson, '{');
                $endPos = strrpos($cleanJson, '}');
                if ($startPos !== false && $endPos !== false && $endPos > $startPos) {
                    $cleanJson = substr($cleanJson, $startPos, $endPos - $startPos + 1);
                }
            }

            $parsed = json_decode($cleanJson, true);

            if (! is_array($parsed)) {
                Log::warning('AI Import CV returned invalid JSON: '.$content);
                throw new \RuntimeException('AI mengembalikan format respon yang tidak valid. Silakan coba ulangi.');
            }

            // Normalize structure to ensure expected keys exist
            $normalizedData = $this->normalizeParsedData($parsed);

            return response()->json([
                'status' => 'success',
                'message' => 'Dokumen CV berhasil dibaca dan disempurnakan oleh AI.',
                'data' => [
                    'parsed' => $normalizedData,
                    'provider_name' => $result['provider_name'],
                    'model_name' => $result['model_name'],
                    'latency_ms' => $result['latency_ms'],
                    'fallback_occurred' => $result['fallback_occurred'],
                    'tone' => $tone,
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('AI Import CV parsing failed: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Layanan AI sedang mengalami kendala saat memproses dokumen. Silakan coba beberapa saat lagi.',
            ], 422);
        }
    }

    /**
     * Apply reviewed and enhanced CV data into the user profile.
     */
    public function apply(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'mode' => ['required', 'string', Rule::in(['replace', 'merge'])],
            'personal_info' => ['nullable', 'array'],
            'personal_info.full_name' => ['nullable', 'string', 'max:255'],
            'personal_info.email' => ['nullable', 'string', 'max:255'],
            'personal_info.whatsapp_number' => ['nullable', 'string', 'max:50'],
            'personal_info.location' => ['nullable', 'string', 'max:255'],
            'personal_info.linkedin_url' => ['nullable', 'string', 'max:255'],
            'personal_info.portfolio_link' => ['nullable', 'string', 'max:255'],
            'about_me' => ['nullable', 'string'],
            'field_of_interest' => ['nullable', 'array'],
            'field_of_interest.*' => ['string'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string'],
            'experiences' => ['nullable', 'array'],
            'experiences.*.company' => ['required', 'string', 'max:255'],
            'experiences.*.position' => ['required', 'string', 'max:255'],
            'experiences.*.location' => ['nullable', 'string', 'max:255'],
            'experiences.*.start_date' => ['nullable', 'string'],
            'experiences.*.end_date' => ['nullable', 'string'],
            'experiences.*.is_current' => ['nullable', 'boolean'],
            'experiences.*.description' => ['nullable', 'array'],
            'experiences.*.description.*' => ['string'],
            'educations' => ['nullable', 'array'],
            'educations.*.institution' => ['required', 'string', 'max:255'],
            'educations.*.degree' => ['nullable', 'string', 'max:255'],
            'educations.*.major' => ['nullable', 'string', 'max:255'],
            'educations.*.start_date' => ['nullable', 'string'],
            'educations.*.end_date' => ['nullable', 'string'],
            'educations.*.gpa' => ['nullable', 'string', 'max:20'],
            'organizations' => ['nullable', 'array'],
            'organizations.*.organizations_name' => ['required', 'string', 'max:255'],
            'organizations.*.role' => ['required', 'string', 'max:255'],
            'organizations.*.start_date' => ['nullable', 'string'],
            'organizations.*.end_date' => ['nullable', 'string'],
            'organizations.*.duration' => ['nullable', 'string', 'max:100'],
            'organizations.*.description' => ['nullable', 'array'],
            'certifications' => ['nullable', 'array'],
            'certifications.*.name' => ['required', 'string', 'max:255'],
            'certifications.*.issuer' => ['required', 'string', 'max:255'],
            'certifications.*.issue_date' => ['nullable', 'string'],
            'certifications.*.expiration_date' => ['nullable', 'string'],
            'certifications.*.validity_period' => ['nullable', 'string', 'max:100'],
            'awards' => ['nullable', 'array'],
            'awards.*.title' => ['required', 'string', 'max:255'],
            'awards.*.subtitle' => ['nullable', 'string', 'max:255'],
            'awards.*.year' => ['nullable', 'string', 'max:20'],
            'awards.*.description' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        /** @var UserProfile $profile */
        $profile = $this->getOrCreateProfile($user);

        if ($profile->isCvImportLocked()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Impor CV di halaman profil tidak dapat dilakukan karena sumber data profil Anda telah dikunci pada saat onboarding.',
            ], 403);
        }

        $mode = $validated['mode'];

        DB::transaction(function () use ($profile, $validated, $mode) {
            $personalInfo = $validated['personal_info'] ?? [];

            if ($mode === 'replace') {
                // In replace mode: Update identity & overwrite collections
                $profileUpdate = array_filter([
                    'full_name' => $personalInfo['full_name'] ?? null,
                    'whatsapp_number' => $personalInfo['whatsapp_number'] ?? null,
                    'email' => $personalInfo['email'] ?? null,
                    'location' => $personalInfo['location'] ?? null,
                    'linkedin_url' => $personalInfo['linkedin_url'] ?? null,
                    'portfolio_link' => $personalInfo['portfolio_link'] ?? null,
                    'about_me' => $validated['about_me'] ?? null,
                ], fn ($val) => $val !== null);

                $profileUpdate['field_of_interest'] = $validated['field_of_interest'] ?? [];
                $profileUpdate['tools'] = $validated['tools'] ?? [];
                $profileUpdate['profile_data_source'] = 'cv_import';

                $profile->update($profileUpdate);

                // Wipe existing collections
                $profile->experiences()->delete();
                $profile->educations()->delete();
                $profile->organizations()->delete();
                $profile->certifications()->delete();
                $profile->awards()->delete();

                // Re-insert incoming items
                $this->insertExperiences($profile, $validated['experiences'] ?? []);
                $this->insertEducations($profile, $validated['educations'] ?? []);
                $this->insertOrganizations($profile, $validated['organizations'] ?? []);
                $this->insertCertifications($profile, $validated['certifications'] ?? []);
                $this->insertAwards($profile, $validated['awards'] ?? []);
            } else {
                // In merge mode: Fill blank fields and append new items
                $profileUpdate = [
                    'profile_data_source' => 'cv_import',
                ];
                if (blank($profile->full_name) && filled($personalInfo['full_name'] ?? null)) {
                    $profileUpdate['full_name'] = $personalInfo['full_name'];
                }
                if (blank($profile->whatsapp_number) && filled($personalInfo['whatsapp_number'] ?? null)) {
                    $profileUpdate['whatsapp_number'] = $personalInfo['whatsapp_number'];
                }
                if (blank($profile->location) && filled($personalInfo['location'] ?? null)) {
                    $profileUpdate['location'] = $personalInfo['location'];
                }
                if (blank($profile->linkedin_url) && filled($personalInfo['linkedin_url'] ?? null)) {
                    $profileUpdate['linkedin_url'] = $personalInfo['linkedin_url'];
                }
                if (blank($profile->portfolio_link) && filled($personalInfo['portfolio_link'] ?? null)) {
                    $profileUpdate['portfolio_link'] = $personalInfo['portfolio_link'];
                }
                if (blank($profile->about_me) && filled($validated['about_me'] ?? null)) {
                    $profileUpdate['about_me'] = $validated['about_me'];
                }

                // Merge array fields without duplicates
                $incomingInterests = $validated['field_of_interest'] ?? [];
                $existingInterests = $profile->field_of_interest ?? [];
                $profileUpdate['field_of_interest'] = array_values(array_unique(array_merge($existingInterests, $incomingInterests)));

                $incomingTools = $validated['tools'] ?? [];
                $existingTools = $profile->tools ?? [];
                $profileUpdate['tools'] = array_values(array_unique(array_merge($existingTools, $incomingTools)));

                $profile->update($profileUpdate);

                // Append new collections (starting sort_order from max existing)
                $this->insertExperiences($profile, $validated['experiences'] ?? [], append: true);
                $this->insertEducations($profile, $validated['educations'] ?? [], append: true);
                $this->insertOrganizations($profile, $validated['organizations'] ?? [], append: true);
                $this->insertCertifications($profile, $validated['certifications'] ?? [], append: true);
                $this->insertAwards($profile, $validated['awards'] ?? [], append: true);
            }
        });

        if (! $user->hasCompletedOnboarding()) {
            $user->completeOnboarding();
        }

        $profile->refresh();
        $profile->load(['experiences', 'educations', 'organizations', 'certifications', 'awards', 'resumes', 'attachments']);

        return response()->json([
            'status' => 'success',
            'message' => 'Data profil berhasil diperbarui dari hasil import CV.',
            'data' => $this->formatProfileResponse($profile),
        ]);
    }

    /**
     * Insert experiences records into profile.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function insertExperiences(UserProfile $profile, array $items, bool $append = false): void
    {
        $startOrder = $append ? ($profile->experiences()->max('sort_order') ?? -1) + 1 : 0;
        foreach ($items as $index => $item) {
            $profile->experiences()->create([
                'company' => $item['company'],
                'position' => $item['position'],
                'location' => filled($item['location'] ?? null) ? $item['location'] : null,
                'start_date' => filled($item['start_date'] ?? null) ? $item['start_date'] : null,
                'end_date' => ! empty($item['is_current']) ? null : (filled($item['end_date'] ?? null) ? $item['end_date'] : null),
                'is_current' => (bool) ($item['is_current'] ?? false),
                'description' => $item['description'] ?? null,
                'sort_order' => $startOrder + $index,
            ]);
        }
    }

    /**
     * Insert educations records into profile.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function insertEducations(UserProfile $profile, array $items, bool $append = false): void
    {
        $startOrder = $append ? ($profile->educations()->max('sort_order') ?? -1) + 1 : 0;
        foreach ($items as $index => $item) {
            $profile->educations()->create([
                'institution' => $item['institution'],
                'degree' => filled($item['degree'] ?? null) ? $item['degree'] : null,
                'major' => filled($item['major'] ?? null) ? $item['major'] : null,
                'start_date' => filled($item['start_date'] ?? null) ? $item['start_date'] : null,
                'end_date' => filled($item['end_date'] ?? null) ? $item['end_date'] : null,
                'gpa' => filled($item['gpa'] ?? null) ? $item['gpa'] : null,
                'description' => filled($item['description'] ?? null) ? (is_array($item['description']) ? implode("\n", $item['description']) : (string) $item['description']) : null,
                'sort_order' => $startOrder + $index,
            ]);
        }
    }

    /**
     * Insert organizations records into profile.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function insertOrganizations(UserProfile $profile, array $items, bool $append = false): void
    {
        $startOrder = $append ? ($profile->organizations()->max('sort_order') ?? -1) + 1 : 0;
        foreach ($items as $index => $item) {
            $profile->organizations()->create([
                'organizations_name' => $item['organizations_name'],
                'role' => $item['role'],
                'start_date' => filled($item['start_date'] ?? null) ? $item['start_date'] : null,
                'end_date' => filled($item['end_date'] ?? null) ? $item['end_date'] : null,
                'duration' => filled($item['duration'] ?? null) ? $item['duration'] : null,
                'description' => array_values(array_filter($item['description'] ?? [])),
                'sort_order' => $startOrder + $index,
            ]);
        }
    }

    /**
     * Insert certifications records into profile.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function insertCertifications(UserProfile $profile, array $items, bool $append = false): void
    {
        $startOrder = $append ? ($profile->certifications()->max('sort_order') ?? -1) + 1 : 0;
        foreach ($items as $index => $item) {
            $profile->certifications()->create([
                'name' => $item['name'],
                'issuer' => $item['issuer'],
                'issue_date' => $item['issue_date'] ?? null,
                'expiration_date' => $item['expiration_date'] ?? null,
                'validity_period' => $item['validity_period'] ?? null,
                'sort_order' => $startOrder + $index,
            ]);
        }
    }

    /**
     * Insert awards records into profile.
     *
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function insertAwards(UserProfile $profile, array $items, bool $append = false): void
    {
        $startOrder = $append ? ($profile->awards()->max('sort_order') ?? -1) + 1 : 0;
        foreach ($items as $index => $item) {
            $profile->awards()->create([
                'title' => $item['title'],
                'subtitle' => $item['subtitle'] ?? null,
                'year' => $item['year'] ?? null,
                'description' => $item['description'] ?? null,
                'sort_order' => $startOrder + $index,
            ]);
        }
    }

    /**
     * Normalize parsed AI structure ensuring default arrays and objects exist.
     *
     * @param  array<string, mixed>  $parsed
     * @return array<string, mixed>
     */
    protected function normalizeParsedData(array $parsed): array
    {
        return [
            'personal_info' => [
                'full_name' => $parsed['personal_info']['full_name'] ?? null,
                'email' => $parsed['personal_info']['email'] ?? null,
                'whatsapp_number' => $parsed['personal_info']['whatsapp_number'] ?? null,
                'location' => $parsed['personal_info']['location'] ?? null,
                'linkedin_url' => $parsed['personal_info']['linkedin_url'] ?? null,
                'portfolio_link' => $parsed['personal_info']['portfolio_link'] ?? null,
            ],
            'about_me' => is_string($parsed['about_me'] ?? null) ? trim($parsed['about_me']) : '',
            'field_of_interest' => is_array($parsed['field_of_interest'] ?? null) ? array_values(array_filter($parsed['field_of_interest'])) : [],
            'tools' => is_array($parsed['tools'] ?? null) ? array_values(array_filter($parsed['tools'])) : [],
            'experiences' => is_array($parsed['experiences'] ?? null) ? array_map(function ($exp) {
                return [
                    'company' => $exp['company'] ?? '',
                    'position' => $exp['position'] ?? '',
                    'location' => $exp['location'] ?? '',
                    'start_date' => $exp['start_date'] ?? '',
                    'end_date' => $exp['end_date'] ?? '',
                    'is_current' => (bool) ($exp['is_current'] ?? false),
                    'description' => is_array($exp['description'] ?? null)
                        ? array_values(array_filter($exp['description']))
                        : (! empty($exp['description']) ? [$exp['description']] : []),
                ];
            }, $parsed['experiences']) : [],
            'educations' => is_array($parsed['educations'] ?? null) ? array_map(function ($edu) {
                return [
                    'institution' => $edu['institution'] ?? '',
                    'degree' => $edu['degree'] ?? '',
                    'major' => $edu['major'] ?? '',
                    'start_date' => $edu['start_date'] ?? '',
                    'end_date' => $edu['end_date'] ?? '',
                    'gpa' => $edu['gpa'] ?? '',
                ];
            }, $parsed['educations']) : [],
            'organizations' => is_array($parsed['organizations'] ?? null) ? array_map(function ($org) {
                return [
                    'organizations_name' => $org['organizations_name'] ?? '',
                    'role' => $org['role'] ?? '',
                    'start_date' => $org['start_date'] ?? '',
                    'end_date' => $org['end_date'] ?? '',
                    'duration' => $org['duration'] ?? '',
                    'description' => is_array($org['description'] ?? null)
                        ? array_values(array_filter($org['description']))
                        : (! empty($org['description']) ? [$org['description']] : []),
                ];
            }, $parsed['organizations']) : [],
            'certifications' => is_array($parsed['certifications'] ?? null) ? array_map(function ($cert) {
                return [
                    'name' => $cert['name'] ?? '',
                    'issuer' => $cert['issuer'] ?? '',
                    'issue_date' => $cert['issue_date'] ?? '',
                    'expiration_date' => $cert['expiration_date'] ?? '',
                    'validity_period' => $cert['validity_period'] ?? '',
                ];
            }, $parsed['certifications']) : [],
            'awards' => is_array($parsed['awards'] ?? null) ? array_map(function ($award) {
                return [
                    'title' => $award['title'] ?? '',
                    'subtitle' => $award['subtitle'] ?? '',
                    'year' => $award['year'] ?? '',
                    'description' => $award['description'] ?? '',
                ];
            }, $parsed['awards']) : [],
        ];
    }

    /**
     * Retrieve or create the UserProfile instance for the user.
     */
    protected function getOrCreateProfile(User $user): UserProfile
    {
        return $user->profile()->firstOrCreate(
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
    }

    /**
     * Standardized formatted array for profile matching UserProfileController.
     *
     * @return array<string, mixed>
     */
    protected function formatProfileResponse(UserProfile $profile): array
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
            'experiences' => $profile->experiences->map(fn ($e) => [
                'id' => $e->id,
                'company' => $e->company,
                'position' => $e->position,
                'location' => $e->location ?: '',
                'start_date' => $e->start_date,
                'end_date' => $e->end_date ?: '',
                'is_current' => (bool) $e->is_current,
                'description' => $e->description ?: '',
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
                'description' => $ed->description ?: '',
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

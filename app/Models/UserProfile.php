<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $full_name
 * @property string|null $whatsapp_number
 * @property string|null $email
 * @property string|null $location
 * @property int|null $age
 * @property string|null $gender
 * @property string|null $about_me
 * @property string|null $career_level
 * @property string|null $profile_data_source
 * @property string|null $portfolio_link
 * @property string|null $linkedin_url
 * @property array<string, string>|null $social_links
 * @property array<int, string>|null $field_of_interest
 * @property array<int, string>|null $employment_type
 * @property array{currency?: string, amount?: int|float, range_text?: string, min_amount?: int|float, max_amount?: int|float}|null $expected_monthly_salary
 * @property array<int, string>|null $tools
 * @property array<int, mixed>|null $job_recommendations
 * @property \Illuminate\Support\Carbon|null $job_recommendations_updated_at
 * @property array<string, mixed>|null $ai_scoring
 * @property \Illuminate\Support\Carbon|null $ai_scoring_updated_at
 * @property array<string, mixed>|null $ai_onboarding_context
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $user
 * @property-read Collection<int, UserExperience> $experiences
 * @property-read Collection<int, UserEducation> $educations
 * @property-read Collection<int, UserOrganization> $organizations
 * @property-read Collection<int, UserCertification> $certifications
 * @property-read Collection<int, UserAward> $awards
 * @property-read Collection<int, UserResume> $resumes
 * @property-read Collection<int, UserAttachment> $attachments
 */
#[Fillable([
    'user_id',
    'full_name',
    'whatsapp_number',
    'email',
    'location',
    'age',
    'gender',
    'about_me',
    'career_level',
    'profile_data_source',
    'portfolio_link',
    'linkedin_url',
    'social_links',
    'field_of_interest',
    'employment_type',
    'expected_monthly_salary',
    'tools',
    'job_recommendations',
    'job_recommendations_updated_at',
    'ai_scoring',
    'ai_scoring_updated_at',
    'ai_onboarding_context',
])]
class UserProfile extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'social_links' => 'array',
            'field_of_interest' => 'array',
            'employment_type' => 'array',
            'expected_monthly_salary' => 'array',
            'tools' => 'array',
            'job_recommendations' => 'array',
            'job_recommendations_updated_at' => 'datetime',
            'ai_scoring' => 'array',
            'ai_scoring_updated_at' => 'datetime',
            'ai_onboarding_context' => 'array',
        ];
    }

    /**
     * Get the user that owns the profile.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the experiences for the profile.
     *
     * @return HasMany<UserExperience, $this>
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(UserExperience::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the educations for the profile.
     *
     * @return HasMany<UserEducation, $this>
     */
    public function educations(): HasMany
    {
        return $this->hasMany(UserEducation::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the organizations for the profile.
     *
     * @return HasMany<UserOrganization, $this>
     */
    public function organizations(): HasMany
    {
        return $this->hasMany(UserOrganization::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the certifications for the profile.
     *
     * @return HasMany<UserCertification, $this>
     */
    public function certifications(): HasMany
    {
        return $this->hasMany(UserCertification::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the awards for the profile.
     *
     * @return HasMany<UserAward, $this>
     */
    public function awards(): HasMany
    {
        return $this->hasMany(UserAward::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the uploaded resumes for the profile.
     *
     * @return HasMany<UserResume, $this>
     */
    public function resumes(): HasMany
    {
        return $this->hasMany(UserResume::class)->latest();
    }

    /**
     * Get the uploaded portfolio attachments for the profile.
     *
     * @return HasMany<UserAttachment, $this>
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(UserAttachment::class)->latest();
    }

    /**
     * Auto-calculate total working experience based on experiences.
     */
    public function calculateTotalExperience(): string
    {
        $experiences = $this->relationLoaded('experiences')
            ? $this->experiences
            : $this->experiences()->get();

        if ($experiences->isEmpty()) {
            return 'Belum ada pengalaman';
        }

        $totalMonths = 0;

        foreach ($experiences as $exp) {
            if (empty($exp->start_date)) {
                continue;
            }

            try {
                $start = Carbon::createFromFormat('Y-m', $exp->start_date)->startOfMonth();
                $end = $exp->is_current || empty($exp->end_date)
                    ? Carbon::now()->endOfMonth()
                    : Carbon::createFromFormat('Y-m', $exp->end_date)->endOfMonth();

                if ($end->greaterThanOrEqualTo($start)) {
                    $months = $start->diffInMonths($end) + 1;
                    $totalMonths += max(1, $months);
                }
            } catch (\Throwable) {
                continue;
            }
        }

        if ($totalMonths <= 0) {
            return 'Belum ada pengalaman';
        }

        $years = intdiv($totalMonths, 12);
        $remainingMonths = $totalMonths % 12;

        if ($years > 0 && $remainingMonths > 0) {
            return "{$years} tahun {$remainingMonths} bulan";
        } elseif ($years > 0) {
            return "{$years} tahun";
        }

        return "{$remainingMonths} bulan";
    }

    /**
     * Auto-fill / resolve latest education summary.
     *
     * @return array{institution: string, degree: string, major: string, status: string}|null
     */
    public function resolveLatestEducation(): ?array
    {
        $educations = $this->relationLoaded('educations')
            ? $this->educations
            : $this->educations()->get();

        if ($educations->isEmpty()) {
            return null;
        }

        // Ambil pendidikan pertama/terakhir berdasarkan urutan atau tanggal
        $latest = $educations->first();

        return [
            'institution' => $latest->institution,
            'degree' => $latest->degree,
            'major' => $latest->major ?? '-',
            'status' => filled($latest->end_date) ? "Lulus ({$latest->end_date})" : 'Sedang Menempuh',
        ];
    }

    /**
     * Calculate profile completeness score (0-100%).
     *
     * @return array{percentage: int, completed_sections: array<string, bool>}
     */
    public function calculateCompleteness(): array
    {
        $hasProfile = filled($this->full_name) && filled($this->whatsapp_number) && filled($this->location);
        $hasSummary = filled($this->about_me);
        $hasPreferences = ! empty($this->field_of_interest) || ! empty($this->employment_type);
        $hasSkills = ! empty($this->tools);
        $hasExperience = $this->relationLoaded('experiences') ? $this->experiences->isNotEmpty() : $this->experiences()->exists();
        $hasEducation = $this->relationLoaded('educations') ? $this->educations->isNotEmpty() : $this->educations()->exists();

        $resumes = $this->relationLoaded('resumes') ? $this->resumes : $this->resumes()->get();
        $attachments = $this->relationLoaded('attachments') ? $this->attachments : $this->attachments()->get();
        $hasResumes = $resumes->isNotEmpty() || $attachments->isNotEmpty();

        $sections = [
            'profile' => $hasProfile,
            'summary' => $hasSummary,
            'preferences' => $hasPreferences,
            'skills' => $hasSkills,
            'experiences' => $hasExperience,
            'educations' => $hasEducation,
            'resumes' => $hasResumes,
        ];

        $completedCount = count(array_filter($sections));
        $percentage = (int) round(($completedCount / count($sections)) * 100);

        return [
            'percentage' => $percentage,
            'completed_sections' => $sections,
        ];
    }

    /**
     * Determine if CV importing to profile is locked.
     */
    public function isCvImportLocked(): bool
    {
        return ! empty($this->profile_data_source);
    }
}

<?php

namespace App\Models;

use Database\Factories\CvFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $template_id
 * @property string $title
 * @property bool $is_published
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read Template|null $template
 * @property-read CvContact|null $contact
 * @property-read CvSummary|null $summary
 * @property-read Collection<int, CvExperience> $experiences
 * @property-read Collection<int, CvEducation> $educations
 * @property-read Collection<int, CvSkill> $skills
 */
#[Fillable(['user_id', 'template_id', 'title', 'is_published'])]
class Cv extends Model
{
    /** @use HasFactory<CvFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    /**
     * Determine if all required basic sections of the CV are complete.
     */
    public function isComplete(): bool
    {
        return $this->completenessChecklist()['is_complete'];
    }

    /**
     * Get the breakdown checklist for CV completeness.
     *
     * @return array{contact: bool, experiences: bool, educations: bool, skills: bool, summary: bool, is_complete: bool}
     */
    public function completenessChecklist(): array
    {
        /** @var CvContact|null $contact */
        $contact = $this->relationLoaded('contact') ? $this->contact : $this->contact()->first();
        $hasContact = $contact !== null
            && filled($contact->first_name)
            && filled($contact->email);

        $hasExperiences = $this->relationLoaded('experiences')
            ? $this->experiences->isNotEmpty()
            : $this->experiences()->exists();

        $hasEducations = $this->relationLoaded('educations')
            ? $this->educations->isNotEmpty()
            : $this->educations()->exists();

        $hasSkills = $this->relationLoaded('skills')
            ? $this->skills->isNotEmpty()
            : $this->skills()->exists();

        /** @var CvSummary|null $summary */
        $summary = $this->relationLoaded('summary') ? $this->summary : $this->summary()->first();
        $hasSummary = $summary !== null && filled(trim(strip_tags($summary->content ?? '')));

        return [
            'contact' => $hasContact,
            'experiences' => $hasExperiences,
            'educations' => $hasEducations,
            'skills' => $hasSkills,
            'summary' => $hasSummary,
            'is_complete' => $hasContact && $hasExperiences && $hasEducations && $hasSkills && $hasSummary,
        ];
    }

    /**
     * Get the user that owns the CV.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template assigned to the CV.
     *
     * @return BelongsTo<Template, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the contact details for the CV.
     *
     * @return HasOne<CvContact, $this>
     */
    public function contact(): HasOne
    {
        return $this->hasOne(CvContact::class);
    }

    /**
     * Get the summary for the CV.
     *
     * @return HasOne<CvSummary, $this>
     */
    public function summary(): HasOne
    {
        return $this->hasOne(CvSummary::class);
    }

    /**
     * Get the experiences for the CV ordered by sort_order ascending.
     *
     * @return HasMany<CvExperience, $this>
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(CvExperience::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the educations for the CV ordered by sort_order ascending.
     *
     * @return HasMany<CvEducation, $this>
     */
    public function educations(): HasMany
    {
        return $this->hasMany(CvEducation::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get the skills for the CV ordered by sort_order ascending.
     *
     * @return HasMany<CvSkill, $this>
     */
    public function skills(): HasMany
    {
        return $this->hasMany(CvSkill::class)->orderBy('sort_order', 'asc');
    }
}

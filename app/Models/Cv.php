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

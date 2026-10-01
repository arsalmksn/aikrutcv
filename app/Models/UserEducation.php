<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_profile_id
 * @property string $institution
 * @property string $degree
 * @property string|null $major
 * @property string|null $start_date
 * @property string|null $end_date
 * @property string|null $gpa
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read UserProfile $userProfile
 */
#[Fillable([
    'user_profile_id',
    'institution',
    'degree',
    'major',
    'start_date',
    'end_date',
    'gpa',
    'sort_order',
])]
class UserEducation extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_educations';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the user profile that owns the education.
     *
     * @return BelongsTo<UserProfile, $this>
     */
    public function userProfile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class);
    }
}

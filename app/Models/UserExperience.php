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
 * @property string $company
 * @property string $position
 * @property string|null $location
 * @property string $start_date
 * @property string|null $end_date
 * @property bool $is_current
 * @property array<int, string>|null $description
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read UserProfile $userProfile
 */
#[Fillable([
    'user_profile_id',
    'company',
    'position',
    'location',
    'start_date',
    'end_date',
    'is_current',
    'description',
    'sort_order',
])]
class UserExperience extends Model
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
            'is_current' => 'boolean',
            'description' => 'array',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the user profile that owns the experience.
     *
     * @return BelongsTo<UserProfile, $this>
     */
    public function userProfile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
 * @property string|null $description
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
            'sort_order' => 'integer',
        ];
    }

    /**
     * Interact with the experience's description.
     *
     * @return Attribute<string|null, string|array<int, string>|null>
     */
    protected function description(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => is_string($value) ? $value : (is_array($value) ? implode("\n", $value) : $value),
            set: function ($value) {
                if (is_array($value)) {
                    $filtered = array_filter(array_map('trim', $value));

                    return empty($filtered) ? null : implode("\n", array_map(fn ($l) => str_starts_with($l, '•') ? $l : "• {$l}", $filtered));
                }

                return filled($value) ? trim((string) $value) : null;
            },
        );
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

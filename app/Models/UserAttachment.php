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
 * @property string $title
 * @property string $file_name
 * @property string $file_path
 * @property string|null $file_url
 * @property string|null $file_type
 * @property int|null $file_size
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read UserProfile $userProfile
 */
#[Fillable([
    'user_profile_id',
    'title',
    'file_name',
    'file_path',
    'file_url',
    'file_type',
    'file_size',
])]
class UserAttachment extends Model
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
            'file_size' => 'integer',
        ];
    }

    /**
     * Get the user profile that owns the attachment.
     *
     * @return BelongsTo<UserProfile, $this>
     */
    public function userProfile(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class);
    }
}

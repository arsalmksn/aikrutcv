<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string|null $google_id
 * @property string|null $avatar
 * @property string|null $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property string $role
 * @property Carbon|null $onboarding_completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Cv> $cvs
 * @property-read UserProfile|null $profile
 */
#[Fillable(['name', 'email', 'password', 'role', 'onboarding_completed_at', 'google_id', 'avatar', 'email_verified_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Determine if the user has a password set.
     */
    public function hasPassword(): bool
    {
        return ! empty($this->password);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'onboarding_completed_at' => 'datetime',
        ];
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarAttribute(?string $value): ?string
    {
        if (filled($value)) {
            if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, 'data:')) {
                return $value;
            }

            return Storage::disk('public')->url($value);
        }

        return 'https://ui-avatars.com/api/?name='.urlencode($this->name ?: 'User').'&background=0284c7&color=fff&size=256';
    }

    /**
     * Determine if the user has an admin role.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Determine if the user has completed initial onboarding.
     */
    public function hasCompletedOnboarding(): bool
    {
        return $this->onboarding_completed_at !== null;
    }

    /**
     * Mark the user onboarding as completed.
     */
    public function completeOnboarding(): void
    {
        $this->forceFill([
            'onboarding_completed_at' => now(),
        ])->save();
    }

    /**
     * Determine if the user has any of the specified roles.
     *
     * @param  string|array<int, string>  $roles
     */
    public function hasRole(string|array $roles): bool
    {
        $roleList = is_array($roles) ? $roles : explode(',', $roles);

        return in_array($this->role, array_map('trim', $roleList), true);
    }

    /**
     * Get all CVs created by the user.
     *
     * @return HasMany<Cv, $this>
     */
    public function cvs(): HasMany
    {
        return $this->hasMany(Cv::class);
    }

    /**
     * Get the master profile of the user.
     *
     * @return HasOne<UserProfile, $this>
     */
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }
}

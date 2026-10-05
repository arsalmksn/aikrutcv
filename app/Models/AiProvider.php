<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiProvider extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'driver',
        'base_url',
        'api_key',
        'custom_headers',
        'is_active',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'has_api_key',
        'masked_api_key',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'api_key',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'api_key' => 'encrypted',
            'custom_headers' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the models associated with the provider.
     */
    public function models(): HasMany
    {
        return $this->hasMany(AiModel::class);
    }

    /**
     * Scope a query to only include active providers.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Determine if an API key is configured.
     */
    public function getHasApiKeyAttribute(): bool
    {
        return ! empty($this->api_key);
    }

    /**
     * Get masked API key for display in UI.
     */
    public function getMaskedApiKeyAttribute(): ?string
    {
        if (empty($this->api_key)) {
            return null;
        }

        $length = strlen($this->api_key);
        if ($length <= 8) {
            return '••••••••';
        }

        return substr($this->api_key, 0, 4).'••••'.substr($this->api_key, -4);
    }
}

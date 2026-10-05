<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiModel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ai_provider_id',
        'name',
        'model_id',
        'priority',
        'is_active',
        'is_default',
        'max_tokens',
        'temperature',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'priority' => 'integer',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
            'max_tokens' => 'integer',
            'temperature' => 'float',
        ];
    }

    /**
     * Get the provider that owns the model.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'ai_provider_id');
    }

    /**
     * Scope a query to only include active models.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order models by priority ascending.
     */
    public function scopeOrderedByPriority(Builder $query): Builder
    {
        return $query->orderBy('priority', 'asc')->orderBy('id', 'asc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $icon
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, CareerSubCategory> $subCategories
 * @property-read Collection<int, CareerRole> $roles
 */
class CareerCategory extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<CareerSubCategory, $this>
     */
    public function subCategories(): HasMany
    {
        return $this->hasMany(CareerSubCategory::class)->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
    }

    /**
     * @return HasManyThrough<CareerRole, CareerSubCategory, $this>
     */
    public function roles(): HasManyThrough
    {
        return $this->hasManyThrough(CareerRole::class, CareerSubCategory::class);
    }

    /**
     * Scope active records.
     *
     * @param  Builder<static>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}

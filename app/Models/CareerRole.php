<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $career_sub_category_id
 * @property string $name
 * @property string $slug
 * @property array<int, string>|null $popular_skills
 * @property int $sort_order
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read CareerSubCategory $subCategory
 */
class CareerRole extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'career_sub_category_id',
        'name',
        'slug',
        'popular_skills',
        'sort_order',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'career_sub_category_id' => 'integer',
            'popular_skills' => 'array',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<CareerSubCategory, $this>
     */
    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(CareerSubCategory::class, 'career_sub_category_id');
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

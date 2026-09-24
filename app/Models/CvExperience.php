<?php

namespace App\Models;

use Database\Factories\CvExperienceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cv_id
 * @property string $company_name
 * @property string $position
 * @property string|null $city
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property bool $is_current
 * @property string|null $description
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Cv $cv
 */
#[Fillable([
    'cv_id',
    'company_name',
    'position',
    'city',
    'start_date',
    'end_date',
    'is_current',
    'description',
    'sort_order',
])]
class CvExperience extends Model
{
    /** @use HasFactory<CvExperienceFactory> */
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
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Get the CV that owns the experience.
     *
     * @return BelongsTo<Cv, $this>
     */
    public function cv(): BelongsTo
    {
        return $this->belongsTo(Cv::class);
    }
}

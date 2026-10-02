<?php

namespace App\Models;

use Database\Factories\CvContactFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $cv_id
 * @property string $first_name
 * @property string|null $last_name
 * @property string|null $desired_job_title
 * @property string|null $expected_salary
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $address
 * @property string|null $city
 * @property string|null $linkedin_url
 * @property string|null $website_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Cv $cv
 */
#[Fillable([
    'cv_id',
    'first_name',
    'last_name',
    'desired_job_title',
    'expected_salary',
    'phone',
    'email',
    'address',
    'city',
    'linkedin_url',
    'website_url',
])]
class CvContact extends Model
{
    /** @use HasFactory<CvContactFactory> */
    use HasFactory;

    /**
     * Get the CV that owns the contact information.
     *
     * @return BelongsTo<Cv, $this>
     */
    public function cv(): BelongsTo
    {
        return $this->belongsTo(Cv::class);
    }
}

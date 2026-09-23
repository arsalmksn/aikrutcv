<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\CvContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvContact>
 */
class CvContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cv_id' => Cv::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'desired_job_title' => fake()->jobTitle(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'address' => fake()->address(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\CvExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvExperience>
 */
class CvExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-5 years', '-1 years')->format('Y-m-d');

        return [
            'cv_id' => Cv::factory(),
            'company_name' => fake()->company(),
            'position' => fake()->jobTitle(),
            'city' => fake()->city(),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, 'now')->format('Y-m-d'),
            'is_current' => false,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 5),
        ];
    }

    /**
     * Indicate that the experience is the current position.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_current' => true,
            'end_date' => null,
        ]);
    }

    /**
     * Indicate that the experience is a past position.
     */
    public function past(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = $attributes['start_date'] ?? fake()->dateTimeBetween('-5 years', '-2 years')->format('Y-m-d');

            return [
                'is_current' => false,
                'start_date' => $startDate,
                'end_date' => fake()->dateTimeBetween($startDate, '-1 month')->format('Y-m-d'),
            ];
        });
    }
}

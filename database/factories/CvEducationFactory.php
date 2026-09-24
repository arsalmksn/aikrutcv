<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\CvEducation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvEducation>
 */
class CvEducationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-6 years', '-2 years')->format('Y-m-d');

        $institutions = [
            'Universitas Indonesia',
            'Institut Teknologi Bandung',
            'Universitas Gadjah Mada',
            'Universitas Diponegoro',
            'Institut Teknologi Sepuluh Nopember',
            'Universitas Brawijaya',
            'Universitas Airlangga',
            'Universitas Padjadjaran',
            'Universitas Telkom',
            'Universitas Bina Nusantara',
        ];

        $degrees = [
            'Sarjana (S1)',
            'Diploma (D3)',
            'Magister (S2)',
            'Sarjana Terapan (D4)',
            'SMA / SMK',
        ];

        $fields = [
            'Teknik Informatika',
            'Sistem Informasi',
            'Ilmu Komputer',
            'Teknik Elektro',
            'Manajemen Bisnis',
            'Desain Komunikasi Visual',
            'Akuntansi',
            'Rekayasa Perangkat Lunak',
        ];

        return [
            'cv_id' => Cv::factory(),
            'institution_name' => fake()->randomElement($institutions),
            'degree' => fake()->randomElement($degrees),
            'field_of_study' => fake()->randomElement($fields),
            'city' => fake()->city(),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, 'now')->format('Y-m-d'),
            'is_current' => false,
            'description' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(0, 5),
        ];
    }

    /**
     * Indicate that the education is currently ongoing.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_current' => true,
            'end_date' => null,
        ]);
    }

    /**
     * Indicate that the education is completed in the past.
     */
    public function past(): static
    {
        return $this->state(function (array $attributes) {
            $startDate = $attributes['start_date'] ?? fake()->dateTimeBetween('-6 years', '-3 years')->format('Y-m-d');

            return [
                'is_current' => false,
                'start_date' => $startDate,
                'end_date' => fake()->dateTimeBetween($startDate, '-1 month')->format('Y-m-d'),
            ];
        });
    }
}

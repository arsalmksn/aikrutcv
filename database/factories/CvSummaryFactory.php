<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\CvSummary;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvSummary>
 */
class CvSummaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $years = fake()->numberBetween(2, 10);
        $role = fake()->randomElement([
            'Software Engineer',
            'Full Stack Developer',
            'Backend Developer',
            'Frontend Engineer',
            'Product Manager',
            'UI/UX Designer',
            'Data Analyst',
            'DevOps Engineer',
        ]);
        $specialty = fake()->randomElement([
            'pengembangan aplikasi berbasis web skala besar',
            'arsitektur microservices dan RESTful API',
            'modern web application dengan React dan Laravel',
            'optimasi performa sistem dan database relational',
            'desain antarmuka pengguna yang berorientasi human-centered design',
            'analisis data bisnis dan visualisasi metrik performa',
        ]);
        $achievement = fake()->randomElement([
            'Berhasil memimpin tim lintas fungsi dalam meluncurkan produk digital dengan tingkat kepuasan pengguna 95%.',
            'Terbukti meningkatkan efisiensi proses backend hingga 40% dan menjaga uptime sistem sebesar 99.9%.',
            'Memiliki rekam jejak yang kuat dalam mengotomatisasi pipeline CI/CD serta mengurangi waktu deployment.',
            'Fokus pada penulisan kode yang bersih, terdokumentasi dengan baik, dan mudah dimaintain.',
        ]);

        $summary = "Profesional {$role} berdedikasi dengan pengalaman {$years}+ tahun dalam {$specialty}. {$achievement} ".fake()->paragraph(2);

        return [
            'cv_id' => Cv::factory(),
            'content' => $summary,
        ];
    }

    /**
     * Indicate that the summary contains HTML/Rich Text formatting.
     */
    public function richText(): static
    {
        return $this->state(function (array $attributes) {
            $content = $attributes['content'] ?? fake()->paragraph();

            return [
                'content' => "<p><strong>Ringkasan Profesional:</strong></p><p>{$content}</p><ul><li>Keahlian utama dalam arsitektur modern</li><li>Komitmen tinggi terhadap kualitas kode</li></ul>",
            ];
        });
    }

    /**
     * Indicate that the summary is empty.
     */
    public function empty(): static
    {
        return $this->state(fn () => [
            'content' => null,
        ]);
    }
}

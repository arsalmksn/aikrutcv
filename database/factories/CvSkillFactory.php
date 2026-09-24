<?php

namespace Database\Factories;

use App\Models\Cv;
use App\Models\CvSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvSkill>
 */
class CvSkillFactory extends Factory
{
    /**
     * Technical skills list.
     *
     * @var array<int, string>
     */
    protected const TECHNICAL_SKILLS = [
        'PHP',
        'Laravel',
        'JavaScript',
        'TypeScript',
        'React',
        'Vue.js',
        'Node.js',
        'PostgreSQL',
        'MySQL',
        'Tailwind CSS',
        'Docker',
        'Git & GitHub',
        'RESTful API',
        'GraphQL',
        'Python',
        'Redis',
        'CI/CD Pipeline',
        'Figma',
    ];

    /**
     * Soft skills list.
     *
     * @var array<int, string>
     */
    protected const SOFT_SKILLS = [
        'Penyelesaian Masalah',
        'Komunikasi Efektif',
        'Kerja Sama Tim',
        'Kepemimpinan',
        'Manajemen Waktu',
        'Berpikir Kritis',
        'Adaptabilitas',
        'Negosiasi',
        'Kreativitas',
        'Perhatian Terhadap Detail',
    ];

    /**
     * Available skill levels.
     *
     * @var array<int, string>
     */
    protected const LEVELS = [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Expert',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $allSkills = array_merge(self::TECHNICAL_SKILLS, self::SOFT_SKILLS);

        return [
            'cv_id' => Cv::factory(),
            'name' => fake()->randomElement($allSkills),
            'level' => fake()->randomElement([...self::LEVELS, null]),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the skill is a technical skill.
     */
    public function technical(): static
    {
        return $this->state(fn () => [
            'name' => fake()->randomElement(self::TECHNICAL_SKILLS),
        ]);
    }

    /**
     * Indicate that the skill is a soft skill.
     */
    public function softSkill(): static
    {
        return $this->state(fn () => [
            'name' => fake()->randomElement(self::SOFT_SKILLS),
        ]);
    }

    /**
     * Indicate that the skill has no level displayed.
     */
    public function withoutLevel(): static
    {
        return $this->state(fn () => [
            'level' => null,
        ]);
    }

    /**
     * Indicate that the skill has a specific level.
     */
    public function withLevel(?string $level = null): static
    {
        return $this->state(fn () => [
            'level' => $level ?? fake()->randomElement(self::LEVELS),
        ]);
    }

    /**
     * Indicate that the skill level is Beginner.
     */
    public function beginner(): static
    {
        return $this->state(fn () => [
            'level' => 'Beginner',
        ]);
    }

    /**
     * Indicate that the skill level is Intermediate.
     */
    public function intermediate(): static
    {
        return $this->state(fn () => [
            'level' => 'Intermediate',
        ]);
    }

    /**
     * Indicate that the skill level is Advanced.
     */
    public function advanced(): static
    {
        return $this->state(fn () => [
            'level' => 'Advanced',
        ]);
    }

    /**
     * Indicate that the skill level is Expert.
     */
    public function expert(): static
    {
        return $this->state(fn () => [
            'level' => 'Expert',
        ]);
    }
}

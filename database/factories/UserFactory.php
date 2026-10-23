<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'user',
            'onboarding_completed_at' => now(),
        ];
    }

    /**
     * Indicate that the user has not completed onboarding.
     */
    public function unonboarded(): static
    {
        return $this->state(fn (array $attributes) => [
            'onboarding_completed_at' => null,
        ]);
    }

    /**
     * Indicate that the user has an admin role.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user authenticated via Google OAuth without a password.
     */
    public function google(): static
    {
        return $this->state(fn (array $attributes) => [
            'google_id' => fake()->numerify('#####################'),
            'avatar' => fake()->imageUrl(100, 100, 'people'),
            'password' => null,
        ]);
    }
}

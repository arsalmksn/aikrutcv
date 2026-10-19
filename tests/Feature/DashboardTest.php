<?php

use App\Models\Cv;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('admin user can visit the dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard returns stats and recent cvs for authenticated user with cvs', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Cv::factory()->count(3)->create([
        'user_id' => $user->id,
    ]);

    $response = $this->get(route('dashboard'));
    $response->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->where('stats.total_cvs', 3)
            ->where('stats.total_cvs_formatted', '03')
            ->has('recentCvs', 3)
        );
});
